const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    location: {
        type: String,
        trim: true,
        maxlength: [250, 'Location cannot exceed 250 characters']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    status: {
        type: String,
        enum: ['published', 'cancelled', 'deleted'],
        default: 'published'
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
        }
    }
});

module.exports = mongoose.model('Event', EventSchema);