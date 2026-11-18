const express = require('express');
const auth = require('../controllers/auth');
const users = require('../controllers/users');

const router = express.Router();

// Routes for authentication and user management
router.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));
router.post('/auth/register', auth.register);
router.post('/auth/signup', auth.register);
router.post('/auth/login', auth.signin);
router.post('/auth/signin', auth.signin);

// Routes for user management
router.get('/users/me', auth.validateToken, users.me);
router.patch('/users/me', auth.validateToken, users.updateMe);
router.put('/users/me', auth.validateToken, users.updateMe);
router.delete('/users/me', auth.validateToken, users.softDeleteMe);


module.exports = router;
