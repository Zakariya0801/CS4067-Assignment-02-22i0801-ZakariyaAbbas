const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: Number, // Since users are stored in PostgreSQL, we use a numerical ID
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId, // Since events are in MongoDB
        ref: 'Event', // Assuming your event model is named 'Event'
        required: true
    },
    tickets: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'canceled', 'pending'],
        default: 'pending'
    },
    paymentDetails: {
        transactionId: String,
        paymentMethod: String,
        paidAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
