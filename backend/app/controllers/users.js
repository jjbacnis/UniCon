/**
 * @file users.js (controller)
 * Handles user management. Lists all users (admin only, enforced in the
 * router), and lets the logged-in user view, update or soft delete their
 * own account. Soft delete sets status to 'deleted' instead of removing
 * the record.
 */

const UsersModel = require('../models/users');

// List all users
module.exports.usersList = async function (req, res, next) {
    try {
        let list = await UsersModel.find({});

        res.json(
            {
                success: true,
                message: "Users List Retrieved Successfully",
                data: list
            }
        );
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// Get the authenticated user's information
module.exports.me = async function (req, res, next) { 
    try {
        const user = await UsersModel.findById(req.auth.id);
        if (!user || user.status === 'deleted') {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// Update the authenticated user's information
module.exports.updateMe = async function (req, res, next) {
    try {
        const allowed = {};
        ['firstName', 'lastName', 'email'].forEach((field) => {
            if (req.body[field] !== undefined) allowed[field] = req.body[field];
        });
        if (req.body.password) {
            const user = await UsersModel.findById(req.auth.id);
            if (!user) {
                const err = new Error('User not found');
                err.status = 404;
                throw err;
            }
            user.password = req.body.password;
            await user.save();
        }
        const user = await UsersModel.findByIdAndUpdate(
            req.auth.id,
            { $set: allowed },
            { new: true, runValidators: true }
        );
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        res.json({ success: true, message: 'User updated successfully', data: user });
    } catch (err) {
        next(err);
    }
};

// Soft delete the authenticated user's account
module.exports.softDeleteMe = async function (req, res, next) {
    try {
        const user = await UsersModel.findByIdAndUpdate(
            req.auth.id,
            { $set: { status: 'deleted', updated: new Date() } },
            { new: true }
        );
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        res.json({ success: true, message: 'User deleted successfully', data: user });
    } catch (err) {
        next(err);
    }
};