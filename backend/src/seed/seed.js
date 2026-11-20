require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const { profiles } = require('./seedData');

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coy_discover';
  await mongoose.connect(uri);

  await User.findOneAndUpdate(
    { username: 'demo_user' },
    {
      username: 'demo_user',
      name: 'Alex Johnson',
      age: 22,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'CS Student & Coffee Enthusiast'
    },
    { upsert: true }
  );

  await Profile.deleteMany({});
  await Swipe.deleteMany({});
  await Match.deleteMany({});

  await Profile.insertMany(profiles);

  console.log('Seeded successfully');
  await mongoose.disconnect();
}

if (require.main === module) {
  seed();
}

module.exports = seed;
