const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controller functions
const {
    registerCase,
    getCaseById,
    getMyCases,
    uploadAdditionalEvidence,
    submitOppositePartyResponse,
    nominateWitnesses,
    createPanel,
} = require('../controllers/caseController');

// Import middleware
const { protect } = require('../utils/authMiddleware');
const upload = require('../utils/fileUpload');

// --- Case API Routes ---

// @route   POST /api/cases/register
// @desc    Register a new case with initial evidence
// @access  Private
router.post(
    '/register',
    protect,
    upload.array('evidence', 5), // 'evidence' is the field name, limit to 5 files
    [
        // --- Input Validation ---
        body('case_type', 'Case type is required').isIn(['FAMILY', 'BUSINESS', 'CRIMINAL', 'COMMUNITY', 'OTHER']),
        body('description', 'Description is required').not().isEmpty(),
        body('opposite_party_name', 'Opposite party name is required').not().isEmpty(),
        body('is_pending_in_court', 'Judicial status must be a boolean').isBoolean(),
    ],
    registerCase
);

// @route   GET /api/cases/mycases
// @desc    Get all cases for the logged-in user
// @access  Private
router.get('/mycases', protect, getMyCases);


// @route   GET /api/cases/:id
// @desc    Get a single case by its ID
// @access  Private
router.get('/:id', protect, getCaseById);


// @route   POST /api/cases/:id/upload-evidence
// @desc    Upload additional documents for a case
// @access  Private
router.post(
    '/:id/upload-evidence',
    protect,
    upload.array('evidence', 5),
    uploadAdditionalEvidence
);


// @route   POST /api/cases/:id/submit-opposite-response
// @desc    Submit the opposite party's response to mediation
// @access  Public (or could be a special link)
// For now, we assume an authenticated user (like an admin or the user themselves) is updating this.
// A more complex system might use a unique, signed URL sent via email.
router.post(
    '/:id/submit-opposite-response',
    protect, // Or a different auth mechanism
    [ body('agreed_to_mediate', 'Response must be a boolean').isBoolean() ],
    submitOppositePartyResponse
);


// @route   POST /api/cases/:id/nominate-witnesses
// @desc    Add one or more witnesses to a case
// @access  Private
router.post(
    '/:id/nominate-witnesses',
    protect,
    [ body('witnesses', 'Witnesses must be an array').isArray({ min: 1 }) ],
    nominateWitnesses
);

// @route   POST /api/cases/:id/create-panel
// @desc    Add panel members to a case
// @access  Private (Likely an Admin task, but placing here for now)
router.post(
    '/:id/create-panel',
    protect,
    [ body('panel_members', 'Panel members must be an array').isArray({ min: 1 }) ],
    createPanel
);


module.exports = router;