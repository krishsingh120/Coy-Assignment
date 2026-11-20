const svc = require('../services/discoverService');

async function getFeed(req, res, next) {
  try {
    const data = await svc.getFeed(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function swipe(req, res, next) {
  try {
    const { profileId, action } = req.body;
    if (!profileId || !action) {
      return res.status(400).json({ success: false, message: 'profileId and action are required' });
    }
    const result = await svc.recordSwipe(req.user._id, profileId, action);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getMatches(req, res, next) {
  try {
    const data = await svc.getMatches(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res) {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      age: req.user.age,
      avatar: req.user.avatar,
      bio: req.user.bio
    }
  });
}

async function reset(req, res, next) {
  try {
    const data = await svc.resetDemo(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFeed,
  swipe,
  getMatches,
  getMe,
  reset
};
