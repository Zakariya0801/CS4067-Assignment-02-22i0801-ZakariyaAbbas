const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    },
    remainingSeats: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    }
});

// Ensure remainingSeats does not exceed totalSeats
eventSchema.pre('save', function (next) {
    if (this.remainingSeats > this.totalSeats) {
        this.remainingSeats = this.totalSeats;
    }
    next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
