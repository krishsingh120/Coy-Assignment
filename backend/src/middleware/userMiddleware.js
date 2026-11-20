const { getDemoUser } = require('../services/discoverService');

async function authUser(req, res, next) {
  try {
    req.user = await getDemoUser();
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authUser };
