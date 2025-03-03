const Booking = require('../models/Booking'); // Import the Booking model

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { userId, eventId, tickets, totalPrice } = req.body;

        const newBooking = new Booking({
            userId,
            eventId,
            tickets,
            totalPrice
        });

        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
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
