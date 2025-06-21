const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

/**
 * @route   POST api/auth/register
 * @desc    Register user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
    check('userType', 'User type must be either musician or client').isIn(['musician', 'client'])
  ],
  authController.register
);

/**
 * @route   POST api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

/**
 * @route   GET api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', auth, authController.getMe);

/**
 * @route   PUT api/auth/password
 * @desc    Update password
 * @access  Private
 */
router.put(
  '/password',
  [
    auth,
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
  ],
  authController.updatePassword
);

/**
 * @route   POST api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  authController.forgotPassword
);

/**
 * @route   POST api/auth/reset-password/:token
 * @desc    Reset password
 * @access  Public
 */
router.post(
  '/reset-password/:token',
  [check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })],
  authController.resetPassword
);

/**
 * @route   DELETE api/auth/me
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/me', auth, authController.deleteAccount);

module.exports = router;