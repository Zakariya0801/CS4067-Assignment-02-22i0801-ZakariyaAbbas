from flask import Flask, request, jsonify
from flask_mail import Mail, Message
import os
app = Flask(__name__)
GMAIL_PERSONAL = os.getenv('GMAIL_PERSONAL')
PASSWORD = os.getenv('PASSWORD')

print("Address = ", GMAIL_PERSONAL)
print("Pasword = ", PASSWORD)
# Email Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Change for different providers
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = GMAIL_PERSONAL  # Replace with your email
app.config['MAIL_PASSWORD'] = PASSWORD  # Use an app password if needed

mail = Mail(app)

# @app.route('/send-email', methods=['POST'])
def send_email(recipients,subject,body):
    if not recipients:
        return jsonify({'error': 'Recipients list is empty'}), 400

    try:
        print(recipients)
        print(subject)
        print(body)
        msg = Message(subject=subject, recipients=recipients, body=body, sender=GMAIL_PERSONAL)
        msg.html = body     
        mail.send(msg)
        return jsonify({'message': f'Email sent successfully to {len(recipients)} users'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
    print("data = ", data)
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
    # if 
    statuss = send_email([data['customer_email']], subject, message)
    return statuss
    # return jsonify({"status": "success", "message": "Booking notification sent successfully"}), 200
    # else:
        # return jsonify({"status": "error", "message": "Failed to send booking notification"}), 500

if __name__ == '__main__':
    app.run(debug=True)