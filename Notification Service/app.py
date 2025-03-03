from flask import Flask, request, jsonify
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import logging
from flask_mail import Mail, Message 


# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Gmail account settings - load from environment variables for security
GMAIL_ADDRESS = os.getenv('GMAIL_ADDRESS')
GMAIL_PASSWORD = os.getenv('GMAIL_PASSWORD')  # App password, not your regular Gmail password
PORT = os.getenv('NEWPORT')  # App password, not your regular Gmail password
mail = Mail(app) # instantiate the mail class 
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'i220801@nu.edu.pk'
app.config['MAIL_PASSWORD'] = 'GPA@3.84'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

def send_email(recipient, subject, message):
    """
    Send an email using Gmail SMTP
    """
    try:
        msg = Message( 
                    subject, 
                    sender ='i220801@nu.edu.pk', 
                    recipients = [recipient] 
                ) 
        msg.body = message
        mail.send(msg) 
        return 'Sent'
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy"}), 200


@app.route('/api/send-booking-notification', methods=['POST'])
def send_booking_notification():
    """
    API endpoint to send a booking confirmation email
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
    data = request.json
    
    # Validate required fields
    required_fields = ['customer_email', 'customer_name', 'service_name', 'booking_date', 'booking_time']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
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
    if send_email(data['customer_email'], subject, message):
        return jsonify({"status": "success", "message": "Booking notification sent successfully"}), 200
    else:
        return jsonify({"status": "error", "message": "Failed to send booking notification"}), 500

if __name__ == '__main__':
    # Check if environment variables are set
    if not GMAIL_ADDRESS or not GMAIL_PASSWORD:
        logger.error("Gmail credentials not set. Please set GMAIL_ADDRESS and GMAIL_PASSWORD environment variables.")
        exit(1)
    
    port = int(os.getenv('PORT', PORT))
    app.run(host='0.0.0.0', port=port, debug=False)