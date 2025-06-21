/**
 * Database Migration Script - Initial Schema Creation
 * 
 * This script creates the initial database collections and indexes
 * for the Session Musician Coordinator application.
 * 
 * To run this migration:
 * node scripts/migrations/001-create-initial-schema.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../../utils/logger');

// Import models
const User = require('../../models/User');
const MusicianProfile = require('../../models/MusicianProfile');
const ClientProfile = require('../../models/ClientProfile');
const Project = require('../../models/Project');
const Booking = require('../../models/Booking');
const Review = require('../../models/Review');
const Message = require('../../models/Message');
const Notification = require('../../models/Notification');
const Payment = require('../../models/Payment');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    logger.info('MongoDB connected for migration');
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

// Create initial indexes
const createIndexes = async () => {
  logger.info('Creating indexes...');

  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ userType: 1 });
    await User.collection.createIndex({ 
      name: 'text', 
      bio: 'text',
      'location.city': 'text',
      'location.state': 'text',
      'location.country': 'text'
    });
    await User.collection.createIndex({ 'location.coordinates': '2dsphere' });
    
    // MusicianProfile indexes
    await MusicianProfile.collection.createIndex({ userId: 1 }, { unique: true });
    await MusicianProfile.collection.createIndex({ 'instruments.name': 1 });
    await MusicianProfile.collection.createIndex({ genres: 1 });
    await MusicianProfile.collection.createIndex({ hourlyRate: 1 });
    await MusicianProfile.collection.createIndex({ averageRating: -1 });
    await MusicianProfile.collection.createIndex({ featured: -1 });
    await MusicianProfile.collection.createIndex({ bookingCount: -1 });
    await MusicianProfile.collection.createIndex({ 'availability.day': 1 });
    
    // ClientProfile indexes
    await ClientProfile.collection.createIndex({ userId: 1 }, { unique: true });
    await ClientProfile.collection.createIndex({ studioName: 'text' });
    await ClientProfile.collection.createIndex({ averageRating: -1 });
    
    // Project indexes
    await Project.collection.createIndex({ clientId: 1 });
    await Project.collection.createIndex({ status: 1 });
    await Project.collection.createIndex({ startDate: 1 });
    await Project.collection.createIndex({ genre: 1 });
    await Project.collection.createIndex({ 
      title: 'text', 
      description: 'text',
      genre: 'text'
    });
    
    // Booking indexes
    await Booking.collection.createIndex({ projectId: 1 });
    await Booking.collection.createIndex({ clientId: 1 });
    await Booking.collection.createIndex({ musicianId: 1 });
    await Booking.collection.createIndex({ status: 1 });
    await Booking.collection.createIndex({ startDateTime: 1 });
    await Booking.collection.createIndex({ endDateTime: 1 });
    
    // Review indexes
    await Review.collection.createIndex({ reviewerId: 1 });
    await Review.collection.createIndex({ receiverId: 1 });
    await Review.collection.createIndex({ bookingId: 1 });
    await Review.collection.createIndex({ projectId: 1 });
    await Review.collection.createIndex({ rating: -1 });
    
    // Message indexes
    await Message.collection.createIndex({ projectId: 1 });
    await Message.collection.createIndex({ senderId: 1 });
    await Message.collection.createIndex({ receiverId: 1 });
    await Message.collection.createIndex({ read: 1 });
    await Message.collection.createIndex({ createdAt: -1 });
    
    // Notification indexes
    await Notification.collection.createIndex({ userId: 1 });
    await Notification.collection.createIndex({ type: 1 });
    await Notification.collection.createIndex({ read: 1 });
    await Notification.collection.createIndex({ createdAt: -1 });
    
    // Payment indexes
    await Payment.collection.createIndex({ bookingId: 1 });
    await Payment.collection.createIndex({ payerId: 1 });
    await Payment.collection.createIndex({ payeeId: 1 });
    await Payment.collection.createIndex({ status: 1 });
    await Payment.collection.createIndex({ createdAt: -1 });
    
    logger.info('All indexes created successfully');
  } catch (err) {
    logger.error(`Error creating indexes: ${err.message}`);
    throw err;
  }
};

// Run migration
const runMigration = async () => {
  try {
    await connectDB();
    await createIndexes();
    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    logger.error(`Migration failed: ${err.message}`);
    process.exit(1);
  }
};

// Execute migration
runMigration();