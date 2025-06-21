const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, userType } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        errors: [{ msg: 'User already exists with this email' }] 
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      userType,
      profileImage: null,
      location: null,
      phone: null,
      bio: null,
      socialLinks: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        userType: user.userType
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

/**
 * Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        errors: [{ msg: 'Invalid credentials' }] 
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        errors: [{ msg: 'Invalid credentials' }] 
      });
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        userType: user.userType
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            profileImage: user.profileImage
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

/**
 * Get authenticated user
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res) => {
  try {
    // Get user without password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

/**
 * Update user password
 * @route PUT /api/auth/password
 * @access Private
 */
exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    // Get user with password
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        errors: [{ msg: 'Current password is incorrect' }] 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.updatedAt = Date.now();

    await user.save();
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist for security
      return res.json({ msg: 'If your email exists, you will receive a password reset link' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real application, send email with reset link
    // using sendgrid, nodemailer, etc.
    
    res.json({ msg: 'If your email exists, you will receive a password reset link' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

/**
 * Reset password with token
 * @route POST /api/auth/reset-password/:token
 * @access Public
 */
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;
  const { token } = req.params;

  try {
    // Find user with the provided token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        errors: [{ msg: 'Invalid or expired password reset token' }] 
      });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.updatedAt = Date.now();

    await user.save();
    res.json({ msg: 'Password has been reset' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

/**
 * Delete user account
 * @route DELETE /api/auth/me
 * @access Private
 */
exports.deleteAccount = async (req, res) => {
  try {
    // Remove user
    await User.findByIdAndDelete(req.user.id);
    
    // In a real application, you would also:
    // 1. Delete related data (profiles, bookings, reviews, etc.)
    // 2. Log the user out by invalidating their token
    
    res.json({ msg: 'User account has been deleted' });
  } catch (err) {
    console.error('Delete account error:', err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};