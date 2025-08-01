const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controller functions
const {
    getAllCases,
    getDashboardStats,
    updateCaseStatus,
    getCaseDetailsForAdmin,
} = require('../controllers/adminController');

// Import middleware
const { protect, admin } = require('../utils/authMiddleware');

// --- Admin API Routes ---
// All routes in this file are protected and require admin privileges.

// @route   GET /api/admin/cases
// @desc    Get all cases with optional filtering
// @access  Private/Admin
router.get('/cases', protect, admin, getAllCases);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, admin, getDashboardStats);

// @route   GET /api/admin/cases/:id
// @desc    Get full details for a single case (admin view)
// @access  Private/Admin
router.get('/cases/:id', protect, admin, getCaseDetailsForAdmin);

// @route   POST /api/admin/cases/:id/update-status
// @desc    Manually update the status of a case
// @access  Private/Admin
router.post(
    '/cases/:id/update-status',
    protect,
    admin,
    [
        // --- Input Validation ---
        body('status', 'A valid status is required').isIn([
            'REGISTERED',
            'AWAITING_RESPONSE',
            'ACCEPTED',
            'REJECTED',
            'PANEL_CREATED',
            'MEDIATION_IN_PROGRESS',
            'RESOLVED',
            'UNRESOLVED'
        ])
    ],
    updateCaseStatus
);

module.exports = router;
