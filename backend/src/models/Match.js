const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    matchedProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate match records for the same pair
matchSchema.index({ userId: 1, matchedProfileId: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
