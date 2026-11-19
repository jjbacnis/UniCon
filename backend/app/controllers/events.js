const Event = require('../models/events');

module.exports.createEvent = async (req, res, next) => {
    try {
        const event = await Event.create(req.body);

        res.json({
            success: true,
            event
        });

    } catch (err) {
        next(err);
    }
};

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