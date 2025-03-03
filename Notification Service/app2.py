from flask import Flask, request, jsonify
from flask_mail import Mail, Message
import os
import json
import pika
import threading
import time

app = Flask(__name__)
GMAIL_PERSONAL = os.getenv('GMAIL_PERSONAL')
PASSWORD = os.getenv('PASSWORD')
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_QUEUE = os.getenv('RABBITMQ_QUEUE', 'email_queue')

# Email Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Change for different providers
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = GMAIL_PERSONAL  # Replace with your email
app.config['MAIL_PASSWORD'] = PASSWORD  # Use an app password if needed

mail = Mail(app)

def send_email(recipients, subject, body):
    if not recipients:
        return {'error': 'Recipients list is empty'}, 400

    try:
        print(f"Sending email to: {recipients}")
        print(f"Subject: {subject}")
        print(f"Body: {body[:100]}...") # Print only the first 100 chars of the body for logging
        
        msg = Message(subject=subject, recipients=recipients, body=body, sender=GMAIL_PERSONAL)
        msg.html = body     
        mail.send(msg)
        return {'message': f'Email sent successfully to {len(recipients)} users'}
    except Exception as e:
        return {'error': str(e)}, 500

def process_message(ch, method, properties, body):
    """Callback function that processes messages from RabbitMQ"""
    try:
        with app.app_context():  # Required to use Flask's mail object
            data = json.loads(body)
            print(f"Processing message: {data}")
            
            if data.get('type') == 'booking_notification':
                booking_data = data.get('data', {})
                response = handle_booking_notification(booking_data)
                print(f"Email sending result: {response}")
            else:
                print(f"Unknown message type: {data.get('type')}")
                
            # Acknowledge the message was processed
            ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Error processing message: {e}")
        # Reject and requeue the message
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

def handle_booking_notification(data):
    """Process booking notification data and send email"""
    # Validate required fields
    required_fields = ['customer_email', 'customer_name', 'service_name', 'booking_date', 'booking_time']
    for field in required_fields:
        if field not in data:
            return {"error": f"Missing required field: {field}"}, 400
    
    # Create email content
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
    
    # Send the email
    return send_email([data['customer_email']], subject, message)

def start_rabbitmq_consumer():
    """Start the RabbitMQ consumer in a separate thread"""
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
    channel = connection.channel()
    
    # Declare a queue (creates if doesn't exist)
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
    
    # Set prefetch to 1 so worker only gets one message at a time
    channel.basic_qos(prefetch_count=1)
    
    # Set up the consumer
    channel.basic_consume(queue=RABBITMQ_QUEUE, on_message_callback=process_message)
    
    print(f" [*] RabbitMQ consumer started. Waiting for messages on queue: {RABBITMQ_QUEUE}")
    try:
        channel.start_consuming()
    except Exception as e:
        print(f"RabbitMQ consumer error: {e}")
        connection.close()

@app.route('/api/send-booking-notification', methods=['POST'])
def send_booking_notification():
    """
    API endpoint to queue a booking confirmation email
    Expected JSON payload:
    {
        "customer_email": "customer@example.com",
        "customer_name": "John Doe",
        "service_name": "Example Service",
        "booking_date": "2025-03-15",
        "booking_time": "14:00",
        "additional_details": "Any special instructions" (optional)
    }
    """
    try:
        data = request.json
        print("Received booking notification request:", data)
        
        # Validate required fields
        required_fields = ['customer_email', 'customer_name', 'service_name', 'booking_date', 'booking_time']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Connect to RabbitMQ
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()
        
        # Ensure the queue exists
        channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
        
        # Prepare the message
        message = {
            'type': 'booking_notification',
            'data': data
        }
        
        # Publish the message
        channel.basic_publish(
            exchange='',
            routing_key=RABBITMQ_QUEUE,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
            )
        )
        
        connection.close()
        return jsonify({"status": "success", "message": "Booking notification queued successfully"}), 200
    
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to queue booking notification: {str(e)}"}), 500

# Start RabbitMQ consumer in a separate thread when the app starts
def setup_rabbitmq():
    consumer_thread = threading.Thread(target=start_rabbitmq_consumer, daemon=True)
    consumer_thread.start()

if __name__ == '__main__':
    # Start the RabbitMQ consumer immediately when running as a script
    consumer_thread = threading.Thread(target=start_rabbitmq_consumer, daemon=True)
    consumer_thread.start()
    
    # Start the Flask app
    setup_rabbitmq()
    app.run(debug=True)