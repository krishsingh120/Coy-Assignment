require('dotenv').config();
const { connectDB, disconnectDB } = require('../utils/db');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const { mockProfiles } = require('./seedData');

async function seed() {
  console.log('[Seed] Starting database seed process...');
  await connectDB();

  try {
    // 1. Seed or ensure Demo User
    const demoUser = await User.findOneAndUpdate(
      { username: 'demo_user' },
      {
        username: 'demo_user',
        name: 'Alex Johnson',
        age: 22,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        bio: 'CS Student & Coffee Enthusiast. Looking to connect!'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[Seed] Demo user ready: ${demoUser.name} (${demoUser._id})`);

    // 2. Clear existing profiles, swipes and matches for a fresh deterministic demo state
    console.log('[Seed] Refreshing mock profiles, swipes and matches...');
    await Profile.deleteMany({});
    await Swipe.deleteMany({});
    await Match.deleteMany({});

    // 3. Insert mock profiles
    const insertedProfiles = await Profile.insertMany(mockProfiles);
    const inboundLikesCount = insertedProfiles.filter((p) => p.hasLikedDemoUser).length;

    console.log(`[Seed] Successfully seeded ${insertedProfiles.length} mock profiles.`);
    console.log(`[Seed] Inbound likes seeded: ${inboundLikesCount} profiles (mutual match candidates).`);
    console.log('[Seed] Database seeding completed successfully.');
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

// Run if called directly
if (require.main === module) {
  seed();
}

module.exports = seed;
