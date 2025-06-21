const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => {
    logger.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  });

// Apply middlewares
// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middlewares
app.use(helmet()); // Set security HTTP headers
app.use(xss()); // Sanitize requests
app.use(mongoSanitize()); // Prevent MongoDB injection

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Enable CORS
app.use(cors());

// Compression
app.use(compression());

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
// Add more routes here as they are created
// app.use('/api/musician-profiles', require('./routes/musicianProfiles'));
// app.use('/api/client-profiles', require('./routes/clientProfiles'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/projects', require('./routes/projects'));
// app.use('/api/reviews', require('./routes/reviews'));
// app.use('/api/search', require('./routes/search'));

// API Documentation
if (process.env.NODE_ENV === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  // Any route not matched by API routes will serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  
  // If in development, send detailed error
  const error = process.env.NODE_ENV === 'development' 
    ? { message: err.message, stack: err.stack }
    : { message: 'Server Error' };
  
  res.status(err.statusCode || 500).json({
    success: false,
    error
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server; // Export for testing