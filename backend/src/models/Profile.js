const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100
    },
    photo: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true,
      trim: true
    },
    cityOrCollege: {
      type: String,
      required: true,
      trim: true
    },
    interests: {
      type: [String],
      default: []
    },
    // Internal seed flag indicating an inbound like on the demo user.
    // select: false ensures this field is NEVER leaked in queries or API responses by default.
    hasLikedDemoUser: {
      type: Boolean,
      default: false,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Index to improve feed lookup performance
profileSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Profile', profileSchema);
