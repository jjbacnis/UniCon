const Event = require('../models/events');

// Get all events
module.exports.getEvents = async (req, res, next) => {
    try {
        const events = await Event.find();

        res.json({
            success: true,
            events
        });
    } catch (err) {
        next(err);
    }
};

// Get one event by ID
module.exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            event
        });
    } catch (err) {
        next(err);
    }
};

// Create an event
module.exports.createEvent = async (req, res, next) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            event
        });
    } catch (err) {
        next(err);
    }
};

// Update an event
module.exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            event
        });
    } catch (err) {
        next(err);
    }
};

// Delete an event
module.exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};