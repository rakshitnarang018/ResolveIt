const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Import controller functions
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');

// Import middleware
const { protect } = require('../utils/authMiddleware');

// --- Rate Limiting for Login ---
// This helps prevent brute-force attacks on user accounts.
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 login requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});


// --- User API Routes ---

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    [
        // --- Input Validation ---
        body('name', 'Name is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        body('age', 'Age must be a number').optional().isInt({ min: 18 }),
        body('phone', 'Phone number is invalid').optional().isMobilePhone(),
    ],
    registerUser
);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginLimiter, loginUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);


module.exports = router;