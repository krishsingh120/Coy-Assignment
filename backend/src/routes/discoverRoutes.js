const express = require('express');
const router = express.Router();
const discoverController = require('../controllers/discoverController');
const { attachDemoUser } = require('../middleware/userMiddleware');

// Attach demo user to all discover endpoints
router.use(attachDemoUser);

// Core assignment endpoints
router.get('/feed', discoverController.getFeed);
router.post('/swipe', discoverController.recordSwipe);
router.get('/matches', discoverController.getMatches);

// Helper endpoints for demo user profile and replay demo
router.get('/me', discoverController.getMe);
router.post('/reset', discoverController.resetDemo);

module.exports = router;
