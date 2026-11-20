const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/discoverController');
const { authUser } = require('../middleware/userMiddleware');

router.use(authUser);

router.get('/feed', ctrl.getFeed);
router.post('/swipe', ctrl.swipe);
router.get('/matches', ctrl.getMatches);
router.get('/me', ctrl.getMe);
router.post('/reset', ctrl.reset);

module.exports = router;
