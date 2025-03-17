import os
import json
import pika
import time
import logging
from flask import Flask
from threading import Thread
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Flask app
app = Flask(__name__)

# Email configuration - Replace with your SMTP settings
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL")

# RabbitMQ configuration
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE")

def send_email(to_email, subject, html_content):
    """Send an email with the given content"""
    try:
        # Create message
        msg = MIMEMultipart()
        logger.info(FROM_EMAIL)
        logger.info(to_email)
        logger.info(subject)
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add HTML content
        msg.attach(MIMEText(html_content, 'html'))
        # logger.info(msg)
        
        # Connect to SMTP server
        logger.info("point 1")
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            logger.info("point 2")
            server.starttls()
            logger.info("point 3")
            logger.info(SMTP_USERNAME)
            logger.info(SMTP_PASSWORD)
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            logger.info("point 4")
            server.send_message(msg)
            logger.info("point 5")
            
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

def format_email_template(data):
    """Format the email template with the provided data"""
    subject = f"Booking Confirmation: {data['service_name']}"
    
    message = f"""
    <html>
    <body>
        <h2>Booking Confirmation</h2>
        <p>Dear {data['customer_name']},</p>
        <p>Thank you for booking our service. Here are your booking details:</p>
        <ul>
            <li><strong>Service:</strong> {data['service_name']}</li>
            <li><strong>Date:</strong> {data['booking_date']}</li>
            <li><strong>Time:</strong> {data['booking_time']}</li>
        </ul>
    """
    
    # Add additional details if provided
    if 'additional_details' in data and data['additional_details']:
        message += f"""
        <p><strong>Additional Information:</strong></p>
        <p>{data['additional_details']}</p>
        """
    
    message += """
        <p>If you need to make any changes to your booking, please contact us.</p>
        <p>Thank you for choosing our service!</p>
    </body>
    </html>
    """
    
    return subject, message

def process_message(ch, method, properties, body):
    """Process messages from the RabbitMQ queue"""
    try:
        # Parse the message
        message_data = json.loads(body)
        logger.info(f"Received message: {message_data['type']}")
        
        if message_data['type'] == 'booking_notification':
            data = message_data['data']
            
            # Get customer email
            customer_email = data['customer_email']
            
            # Format email content
            subject, html_content = format_email_template(data)
            
            # Send the email
            if send_email(customer_email, subject, html_content):
                logger.info(f"Booking notification email sent to {customer_email}")
                # Acknowledge the message
                ch.basic_ack(delivery_tag=method.delivery_tag)
            else:
                # Negative acknowledgment to requeue the message
                logger.warning("Failed to send email, requeuing message")
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        else:
            logger.warning(f"Unknown message type: {message_data['type']}")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        # Negative acknowledgment in case of error
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)


def start_consumer():
    """Start the RabbitMQ consumer"""
    while True:
        try:
            # Connect to RabbitMQ
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            channel = connection.channel()
            
            # Declare the queue
            channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
            
            # Set QoS (prefetch_count=1 ensures one message is processed at a time)
            channel.basic_qos(prefetch_count=1)
            
            # Set up the consumer
            channel.basic_consume(queue=RABBITMQ_QUEUE, on_message_callback=process_message)
            
            logger.info(f"Email consumer started, waiting for messages on queue: {RABBITMQ_QUEUE}")
            channel.start_consuming()
            
        except pika.exceptions.AMQPConnectionError as e:
            logger.error(f"AMQP Connection Error: {str(e)}")
            logger.info("Retrying connection in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            logger.info("Retrying connection in 5 seconds...")
            time.sleep(5)


@app.route('/health')
def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy"}, 200


if __name__ == "__main__":
    # Start the consumer in a separate thread
    consumer_thread = Thread(target=start_consumer, daemon=True)
    consumer_thread.start()
    
    # Start the Flask app
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)