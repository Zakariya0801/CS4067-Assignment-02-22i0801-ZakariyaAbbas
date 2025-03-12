const axiosInstance = require('../Services/axiosInstance');
const Booking = require('../models/Booking'); // Import the Booking model

// Create a new booking
const amqp = require('amqplib');

exports.createBooking = async (req, res) => {
    try {
        const { userId, eventId, tickets, totalPrice, additionalDetails } = req.body;
        // Create and save the booking
        const newBooking = new Booking({
            userId,
            eventId,
            tickets,
            totalPrice
        });
        
        await newBooking.save();
        const user = await axiosInstance.get(`/users/${userId}`);
        // Send email notification via RabbitMQ
        try {
            // Connect to RabbitMQ
            
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            
            // Declare the queue
            const queue = 'email_queue';
            await channel.assertQueue(queue, { durable: true });
            
            // Prepare email notification data
            const emailData = {
                type: 'booking_notification',
                data: {
                    customer_email: user.email,
                    customer_name: user.name,
                    service_name: `Booking #${newBooking._id}`,
                    booking_date: bookingDate || new Date().toISOString().split('T')[0],
                    booking_time: bookingTime || 'Not specified',
                    additional_details: additionalDetails || `Tickets: ${tickets}, Total Price: ${totalPrice}`
                }
            };
            
            // Send message to queue
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
                persistent: true
            });
            
            console.log("✓ Email notification queued");
            
            // Close the connection after sending
            setTimeout(() => {
                connection.close();
            }, 500);
        } catch (notificationError) {
            console.error("Failed to queue email notification:", notificationError);
            // Note: We don't want to fail the booking creation if notification fails
        }

        res.status(201).json({ 
            success: true, 
            message: 'Booking created successfully', 
            booking: newBooking 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error creating booking', 
            error: error.message 
        });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('eventId'); // Populate event details
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
    }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('eventId');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
    }
};

// Update booking (status or payment details)
exports.updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
    }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
    }
};
