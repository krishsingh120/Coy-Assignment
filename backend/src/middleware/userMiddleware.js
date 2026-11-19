const { getDemoUser } = require('../services/discoverService');

/**
 * Middleware to attach the demo user to req.user.
 * Satisfies assignment assumption of single logged-in user without unnecessary external auth.
 */
async function attachDemoUser(req, res, next) {
  try {
    const user = await getDemoUser();
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  attachDemoUser
};
