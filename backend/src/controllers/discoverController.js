const discoverService = require('../services/discoverService');

/**
 * GET /feed
 * Returns profiles that the demo user has not yet swiped on.
 */
async function getFeed(req, res, next) {
  try {
    const feed = await discoverService.getFeed(req.user._id);
    res.status(200).json(feed);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /swipe
 * Records a LIKE or PASS swipe and creates a match if mutual.
 */
async function recordSwipe(req, res, next) {
  try {
    const { profileId, action } = req.body;

    if (!profileId || !action) {
      return res.status(400).json({
        success: false,
        message: 'profileId and action (LIKE or PASS) are required.'
      });
    }

    const result = await discoverService.recordSwipe({
      userId: req.user._id,
      profileId,
      action
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /matches
 * Returns list of mutual matches.
 */
async function getMatches(req, res, next) {
  try {
    const matches = await discoverService.getMatches(req.user._id);
    res.status(200).json(matches);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /me
 * Returns current logged-in demo user profile.
 */
async function getMe(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        age: req.user.age,
        avatar: req.user.avatar,
        bio: req.user.bio
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /reset
 * Resets swipes and matches for easy demonstration & testing.
 */
async function resetDemo(req, res, next) {
  try {
    const result = await discoverService.resetDemoData(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFeed,
  recordSwipe,
  getMatches,
  getMe,
  resetDemo
};
