/**
 * @file auth.js (controller)
 * Handles authentication. Registers new users and signs in existing
 * users, returning a JWT token that expires in 20 minutes. Also exports
 * two middleware functions: validateToken (checks the Bearer token and
 * stores its data on req.auth) and requireAdmin (blocks non-admins).
 */

const User = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to retrieve the JWT secret key from environment variables
const privateKey = () => {
    const secret = process.env.JWT_SECRET || process.env.SECRETKEY;
    if (!secret) throw new Error('JWT_SECRET or SECRETKEY environment variable is required');
    return secret;
};

// Sign in a user and return a JWT token
module.exports.signin = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const err = new Error('Email and password are required');
            err.status = 400;
            throw err;
        }

        // Only active users may sign in.
        const user = await User.findOne({ email: email.toLowerCase(), status: 'active' })
            .select('+hashed_password');
        if (!user || !user.authenticate(password)) {
            const err = new Error('Email and/or password do not match');
            err.status = 401;
            throw err;
        }

        const payload = { id: user._id.toString(), email: user.email, admin: user.admin };
        const token = jwt.sign(payload, privateKey(), { algorithm: 'HS256', expiresIn: '20m' });
        res.json({ success: true, message: 'User authenticated successfully', token, user });
        console.log(`User: ${user.email} signed in successfully`);
    } catch (err) {
        next(err);
    }
};

// Register a new user and return a JWT token
module.exports.register = async function (req, res, next) {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!email || !password) {
            const err = new Error('Email and password are required');
            err.status = 400;
            throw err;
        }
        const user = new User({ firstName, lastName, email, admin: false });
        user.password = password;
        await user.save();
        const payload = { id: user._id.toString(), email: user.email, admin: user.admin };
        const token = jwt.sign(payload, privateKey(), { algorithm: 'HS256', expiresIn: '20m' });
        res.status(201).json({ success: true, message: 'User registered successfully', token, user });

        console.log(`User: ${user.email} registered successfully`);

    } catch (err) {
        if (err.code === 11000) err.status = 409;
        console.log(err);
        next(err);
    }
};

// Middleware to validate JWT token and attach user info to request
module.exports.validateToken = function (req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        const err = new Error('Authentication required');
        err.status = 401;
        return next(err);
    }
    try {
        req.auth = jwt.verify(authorization.slice(7), privateKey(), { algorithms: ['HS256'] });
        next();
    } catch (err) {
        err.status = 401;
        err.message = 'Invalid or expired token';
        next(err);
    }
};

// Middleware to check if the authenticated user has admin privileges
module.exports.requireAdmin = function (req, res, next) {
    if (!req.auth || !req.auth.admin) {
        const err = new Error('Administrator access required');
        err.status = 403;
        return next(err);
    }
    next();
};

