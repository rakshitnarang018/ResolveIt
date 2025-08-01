const { PrismaClient, CaseStatus, FileType } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

/**
 * Maps a file's MIME type to our schema's FileType enum.
 * @param {string} mimeType - The MIME type of the uploaded file.
 * @returns {FileType} - The corresponding enum value.
 */
const getFileTypeEnum = (mimeType) => {
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    if (mimeType.startsWith('audio/')) return FileType.AUDIO;
    return FileType.DOCUMENT;
};


/**
 * @desc    Register a new case
 * @route   POST /api/cases/register
 * @access  Private
 */
const registerCase = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        case_type,
        description,
        is_pending_in_court,
        case_number,
        institution_name,
        opposite_party_name,
        opposite_party_email,
        opposite_party_phone,
        opposite_party_address
    } = req.body;

    const userId = req.user.id;
    const files = req.files; // From multer upload middleware

    try {
        // --- Use Prisma Transaction for Atomic Operation ---
        // This ensures that we either create the case, opposite party, and all evidence records,
        // or we create none of them if an error occurs.
        const newCase = await prisma.$transaction(async (tx) => {
            // 1. Create the Case
            const createdCase = await tx.case.create({
                data: {
                    user_id: userId,
                    case_type,
                    description,
                    is_pending_in_court: is_pending_in_court === 'true',
                    case_number,
                    institution_name,
                    status: CaseStatus.REGISTERED,
                },
            });

            // 2. Create the Opposite Party
            await tx.oppositeParty.create({
                data: {
                    case_id: createdCase.id,
                    name: opposite_party_name,
                    email: opposite_party_email,
                    phone: opposite_party_phone,
                    address: opposite_party_address,
                },
            });

            // 3. Create Evidence records if files were uploaded
            if (files && files.length > 0) {
                const evidenceData = files.map(file => ({
                    case_id: createdCase.id,
                    file_type: getFileTypeEnum(file.mimetype),
                    file_url: `/uploads/${file.filename}`, // URL path to access the file
                }));
                await tx.evidence.createMany({
                    data: evidenceData,
                });
            }
            
            return createdCase;
        });

        // --- Emit Real-time Event ---
        const io = req.app.get('io');
        io.emit('newCase', { message: `New case #${newCase.id} has been registered.`, case: newCase });

        res.status(201).json(newCase);

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single case by ID
 * @route   GET /api/cases/:id
 * @access  Private
 */
const getCaseById = async (req, res, next) => {
    try {
        const caseDetails = await prisma.case.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: { select: { id: true, name: true, email: true } }, // Case owner
                opposite_parties: true,
                evidence: true,
                panel_members: true,
                witnesses: true,
            },
        });

        if (!caseDetails) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // --- Authorization Check ---
        // Ensure the user requesting is either the case owner or an admin
        if (caseDetails.user_id !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to view this case' });
        }

        res.json(caseDetails);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all cases for the logged-in user
 * @route   GET /api/cases/mycases
 * @access  Private
 */
const getMyCases = async (req, res, next) => {
    try {
        const cases = await prisma.case.findMany({
            where: { user_id: req.user.id },
            orderBy: { created_at: 'desc' },
            include: {
                opposite_parties: {
                    take: 1
                }
            }
        });
        res.json(cases);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Submit opposite party's response
 * @route   POST /api/cases/:id/submit-opposite-response
 * @access  Private (for now)
 */
const submitOppositePartyResponse = async (req, res, next) => {
    const { agreed_to_mediate } = req.body;
    const caseId = parseInt(req.params.id);

    try {
        const updatedOppositeParty = await prisma.oppositeParty.updateMany({
            where: { case_id: caseId },
            data: {
                agreed_to_mediate: agreed_to_mediate === 'true',
                responded_at: new Date(),
                notified: true, // Assuming notification was sent before this
            },
        });

        if (updatedOppositeParty.count === 0) {
            return res.status(404).json({ message: 'Case or opposite party not found.' });
        }

        // Update case status based on response
        const newStatus = agreed_to_mediate === 'true' ? CaseStatus.ACCEPTED : CaseStatus.REJECTED;
        const updatedCase = await prisma.case.update({
            where: { id: caseId },
            data: { status: newStatus },
        });

        // --- Emit Real-time Event ---
        const io = req.app.get('io');
        io.to(caseId.toString()).emit('statusUpdate', { caseId, status: newStatus });
        io.emit('caseUpdate', { message: `Case #${caseId} status updated to ${newStatus}.`, case: updatedCase });

        res.json({ message: 'Response submitted successfully', status: newStatus });
    } catch (error) {
        next(error);
    }
};

// --- Stubs for other functions to be implemented ---

const uploadAdditionalEvidence = async (req, res, next) => {
    // Logic to add more evidence files to an existing case
    res.status(501).json({ message: 'Not implemented yet' });
};

const nominateWitnesses = async (req, res, next) => {
    // Logic to add witnesses to a case
    res.status(501).json({ message: 'Not implemented yet' });
};

const createPanel = async (req, res, next) => {
    // Logic to create a panel, including validation of member types
    res.status(501).json({ message: 'Not implemented yet' });
};


module.exports = {
    registerCase,
    getCaseById,
    getMyCases,
    uploadAdditionalEvidence,
    submitOppositePartyResponse,
    nominateWitnesses,
    createPanel,
};
