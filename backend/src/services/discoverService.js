const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

async function getDemoUser() {
  let user = await User.findOne({ username: 'demo_user' });
  if (!user) {
    user = await User.create({
      username: 'demo_user',
      name: 'Alex Johnson',
      age: 22,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'CS Student & Coffee Enthusiast'
    });
  }
  return user;
}

async function getFeed(userId) {
  const swiped = await Swipe.find({ userId }).select('profileId').lean();
  const swipedIds = swiped.map((s) => s.profileId);

  const profiles = await Profile.find({ _id: { $nin: swipedIds } })
    .select('_id name age photo bio cityOrCollege interests')
    .sort({ createdAt: -1 })
    .lean();

  return { success: true, count: profiles.length, profiles };
}

async function recordSwipe(userId, profileId, action) {
  const act = String(action).toUpperCase();
  if (!['LIKE', 'PASS'].includes(act)) {
    const err = new Error('Invalid action, must be LIKE or PASS');
    err.status = 400;
    throw err;
  }

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    const err = new Error('Invalid profile ID');
    err.status = 400;
    throw err;
  }

  const profile = await Profile.findById(profileId).select('+hasLikedDemoUser');
  if (!profile) {
    const err = new Error('Profile not found');
    err.status = 404;
    throw err;
  }

  const exists = await Swipe.findOne({ userId, profileId });
  if (exists) {
    const err = new Error('Profile already swiped');
    err.status = 409;
    throw err;
  }

  await Swipe.create({ userId, profileId, action: act });

  if (act === 'LIKE' && profile.hasLikedDemoUser) {
    const match = await Match.findOneAndUpdate(
      { userId, matchedProfileId: profileId },
      { userId, matchedProfileId: profileId },
      { upsert: true, new: true }
    );

    return {
      success: true,
      matched: true,
      match: {
        id: match._id,
        profile: {
          id: profile._id,
          name: profile.name,
          age: profile.age,
          photo: profile.photo,
          bio: profile.bio,
          cityOrCollege: profile.cityOrCollege,
          interests: profile.interests
        }
      }
    };
  }

  return { success: true, matched: false };
}

async function getMatches(userId) {
  const records = await Match.find({ userId })
    .populate('matchedProfileId', '_id name age photo bio cityOrCollege interests')
    .sort({ createdAt: -1 })
    .lean();

  const matches = records
    .filter((r) => r.matchedProfileId)
    .map((r) => ({
      matchId: r._id,
      matchedAt: r.createdAt,
      profile: r.matchedProfileId
    }));

  return { success: true, count: matches.length, matches };
}

async function resetDemo(userId) {
  await Swipe.deleteMany({ userId });
  await Match.deleteMany({ userId });
  return { success: true, message: 'Reset successful' };
}

module.exports = {
  getDemoUser,
  getFeed,
  recordSwipe,
  getMatches,
  resetDemo
};
