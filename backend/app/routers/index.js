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
router.use('/events', auth.validateToken);
router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);
router.post('/events', eventController.createEvent);
router.patch('/events/:id', requireAdmin, eventController.updateEvent);
router.delete('/events/:id', requireAdmin, eventController.deleteEvent);

module.exports = router;