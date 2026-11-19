const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    },
    action: {
      type: String,
      enum: ['LIKE', 'PASS'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate swipes by the same user on the same profile
swipeSchema.index({ userId: 1, profileId: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
