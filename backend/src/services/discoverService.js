const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

const DEMO_USERNAME = 'demo_user';

/**
 * Get the seeded demo user record.
 */
async function getDemoUser() {
  let user = await User.findOne({ username: DEMO_USERNAME });
  if (!user) {
    user = await User.create({
      username: DEMO_USERNAME,
      name: 'Alex Johnson',
      age: 22,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'CS Student & Coffee Enthusiast. Looking to connect!'
    });
  }
  return user;
}

/**
 * Get feed of profiles that the current user has not yet swiped on.
 * PRIVACY GUARANTEE: Never exposes inbound likes or internal flags.
 */
async function getFeed(userId) {
  // 1. Fetch all profile IDs already swiped by this user
  const swipedRecords = await Swipe.find({ userId }).select('profileId').lean();
  const swipedProfileIds = swipedRecords.map((s) => s.profileId);

  // 2. Fetch profiles excluding swiped IDs
  // Note: hasLikedDemoUser is schema-level select: false, so it is never returned.
  const profiles = await Profile.find({
    _id: { $nin: swipedProfileIds }
  })
    .select('_id name age photo bio cityOrCollege interests createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return {
    success: true,
    count: profiles.length,
    profiles
  };
}

/**
 * Record a swipe (LIKE or PASS).
 * If LIKE, checks for mutual like and creates a match.
 */
async function recordSwipe({ userId, profileId, action }) {
  // Validate action
  const normalizedAction = String(action).toUpperCase();
  if (!['LIKE', 'PASS'].includes(normalizedAction)) {
    const error = new Error('Invalid swipe action. Must be LIKE or PASS.');
    error.statusCode = 400;
    throw error;
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    const error = new Error('Invalid profile ID format.');
    error.statusCode = 400;
    throw error;
  }

  // Verify target profile exists
  // We explicitly select +hasLikedDemoUser ONLY in this backend service for match verification.
  const targetProfile = await Profile.findById(profileId).select('+hasLikedDemoUser');
  if (!targetProfile) {
    const error = new Error('Profile not found.');
    error.statusCode = 404;
    throw error;
  }

  // Check for duplicate swipe
  const existingSwipe = await Swipe.findOne({ userId, profileId });
  if (existingSwipe) {
    const error = new Error('You have already swiped on this profile.');
    error.statusCode = 409;
    throw error;
  }

  // Persist swipe
  await Swipe.create({
    userId,
    profileId,
    action: normalizedAction
  });

  // If PASS, no match can occur
  if (normalizedAction === 'PASS') {
    return {
      success: true,
      matched: false
    };
  }

  // If LIKE, check for mutual like
  const isMutual = Boolean(targetProfile.hasLikedDemoUser);

  if (isMutual) {
    // Create match if not already existing
    const match = await Match.findOneAndUpdate(
      { userId, matchedProfileId: profileId },
      { userId, matchedProfileId: profileId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return {
      success: true,
      matched: true,
      match: {
        id: match._id,
        profile: {
          id: targetProfile._id,
          name: targetProfile.name,
          age: targetProfile.age,
          photo: targetProfile.photo,
          bio: targetProfile.bio,
          cityOrCollege: targetProfile.cityOrCollege,
          interests: targetProfile.interests
        }
      }
    };
  }

  // Unilateral like -> privacy maintained, no match created
  return {
    success: true,
    matched: false
  };
}

/**
 * Get all mutual matches for the current user.
 * PRIVACY GUARANTEE: Returns only confirmed mutual matches.
 */
async function getMatches(userId) {
  const matches = await Match.find({ userId })
    .populate({
      path: 'matchedProfileId',
      select: '_id name age photo bio cityOrCollege interests'
    })
    .sort({ createdAt: -1 })
    .lean();

  // Filter out any populated matches where the profile may have been deleted
  const validMatches = matches
    .filter((m) => m.matchedProfileId)
    .map((m) => ({
      matchId: m._id,
      matchedAt: m.createdAt,
      profile: m.matchedProfileId
    }));

  return {
    success: true,
    count: validMatches.length,
    matches: validMatches
  };
}

/**
 * Reset demo swipes & matches (convenience utility for reviewers & testing).
 */
async function resetDemoData(userId) {
  await Swipe.deleteMany({ userId });
  await Match.deleteMany({ userId });
  return {
    success: true,
    message: 'Demo swipes and matches reset successfully.'
  };
}

module.exports = {
  getDemoUser,
  getFeed,
  recordSwipe,
  getMatches,
  resetDemoData
};
