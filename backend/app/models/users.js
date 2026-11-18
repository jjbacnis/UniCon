const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid e-mail address']
    },
    hashed_password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    qrToken: {
        type: String,
        unique: true,
        sparse: true,
        default: () => crypto.randomUUID()
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active'
    },
    created: { type: Date, default: Date.now, immutable: true },
    updated: { type: Date, default: Date.now },
    admin: { type: Boolean, default: false }
}, {
    collection: 'users',
    timestamps: false
});

UserSchema.virtual('fullName') // virtual attribute gets a full name and sets the first and last name when a full name is provided
    .get(function () {
        return [this.firstName, this.lastName].filter(Boolean).join(' ');
    })
    .set(function (fullName) {
        let splitName = fullName.split(' ');
        this.firstName = splitName[0] || '';
        this.lastName = splitName[1] || '';
    });


UserSchema.virtual('password')
    .set(function (password) {
        if (typeof password !== 'string' || password.length < 6) {
            throw new Error('Password must be at least 6 characters.');
        }
        this.hashed_password = bcrypt.hashSync(password, 12);
    });

UserSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password, 12);
};

UserSchema.methods.authenticate = function (password) {
    return bcrypt.compareSync(password, this.hashed_password);
};

UserSchema.pre('save', function () {
    this.updated = new Date();
});


// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hashed_password;
    }
});

module.exports = mongoose.model('Users', UserSchema);