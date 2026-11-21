/**
 * @file index.js (routers)
 * Defines every API endpoint (mounted under /api) and which middleware
 * protects it.
 *  - Auth: register and login (public).
 *  - Users: all routes need a token; listing all users also needs admin.
 *  - Events: listing and viewing are public; create and update need a
 *    token; delete needs a token and admin.
 */

const express = require('express');
const auth = require('../controllers/auth');
const users = require('../controllers/users');
const eventController = require('../controllers/events');

const router = express.Router();

// Routes for authentication and user management
router.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.signin);

// Routes for user management
router.get('/users', auth.validateToken, auth.requireAdmin, users.usersList);
router.get('/users/me', auth.validateToken, users.me);
router.patch('/users/me', auth.validateToken, users.updateMe);
router.put('/users/me', auth.validateToken, users.updateMe);
router.delete('/users/me', auth.validateToken, users.softDeleteMe);

// Routes for event management
router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);

router.post(
    '/events',
    auth.validateToken,
    eventController.createEvent
);

router.patch(
    '/events/:id',
    auth.validateToken,
    eventController.updateEvent
);

router.delete(
    '/events/:id',
    auth.validateToken,
    auth.requireAdmin,
    eventController.deleteEvent
);
module.exports = router;