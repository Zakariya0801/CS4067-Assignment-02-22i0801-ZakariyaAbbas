const Event = require('../models/EventModel'); // Adjust path as needed

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            remainingSeats: req.body.totalSeats
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
    try {
        console.log("herer")
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
