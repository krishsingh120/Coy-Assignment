const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    photo: { type: String, required: true },
    bio: { type: String, required: true },
    cityOrCollege: { type: String, required: true },
    interests: { type: [String], default: [] },
    hasLikedDemoUser: { type: Boolean, default: false, select: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
