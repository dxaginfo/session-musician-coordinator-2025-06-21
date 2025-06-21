const mongoose = require('mongoose');

/**
 * User Schema
 * Base schema for all users (musicians and clients)
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['musician', 'client'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  phone: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  socialLinks: [{
    platform: { type: String },
    url: { type: String }
  }],
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  }
});

// Remove sensitive information when converting to JSON
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  delete user.verificationToken;
  return user;
};

// Create a text index for search functionality
UserSchema.index({ 
  name: 'text', 
  bio: 'text',
  'location.city': 'text',
  'location.state': 'text',
  'location.country': 'text'
});

module.exports = mongoose.model('User', UserSchema);