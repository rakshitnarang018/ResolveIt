const { PrismaClient, CaseStatus } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

/**
 * @desc    Get all cases with filtering
 * @route   GET /api/admin/cases
 * @access  Private/Admin
 */
const getAllCases = async (req, res, next) => {
    const { status, type, date, search } = req.query;

    try {
        const whereClause = {};

        if (status) {
            whereClause.status = status;
        }
        if (type) {
            whereClause.case_type = type;
        }
        if (date) {
            // Filter by cases created on a specific date
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            whereClause.created_at = {
                gte: startDate,
                lt: endDate,
            };
        }
        if (search) {
            // Basic search by case description or opposite party name
            whereClause.OR = [
                { description: { contains: search, mode: 'insensitive' } },
                { opposite_parties: { some: { name: { contains: search, mode: 'insensitive' } } } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const cases = await prisma.case.findMany({
            where: whereClause,
            include: {
                user: { select: { name: true, email: true } },
                opposite_parties: { select: { name: true } },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        res.json(cases);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res, next) => {
    try {
        const totalCases = await prisma.case.count();
        
        const caseCountsByStatus = await prisma.case.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        // Format the stats into a more friendly object
        const stats = {
            totalCases,
            pending: 0,
            inProgress: 0,
            resolved: 0,
            unresolved: 0,
        };

        caseCountsByStatus.forEach(item => {
            const count = item._count.status;
            switch (item.status) {
                case CaseStatus.REGISTERED:
                case CaseStatus.AWAITING_RESPONSE:
                    stats.pending += count;
                    break;
                case CaseStatus.ACCEPTED:
                case CaseStatus.PANEL_CREATED:
                case CaseStatus.MEDIATION_IN_PROGRESS:
                    stats.inProgress += count;
                    break;
                case CaseStatus.RESOLVED:
                    stats.resolved = count;
                    break;
                case CaseStatus.UNRESOLVED:
                case CaseStatus.REJECTED:
                    stats.unresolved += count;
                    break;
            }
        });

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get full details for a single case (admin view)
 * @route   GET /api/admin/cases/:id
 * @access  Private/Admin
 */
const getCaseDetailsForAdmin = async (req, res, next) => {
     try {
        const caseDetails = await prisma.case.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                opposite_parties: true,
                evidence: true,
                panel_members: true,
                witnesses: true,
            },
        });

        if (!caseDetails) {
            return res.status(404).json({ message: 'Case not found' });
        }

        res.json(caseDetails);
    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Manually update the status of a case
 * @route   POST /api/admin/cases/:id/update-status
 * @access  Private/Admin
 */
const updateCaseStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const caseId = parseInt(req.params.id);

    try {
        const updatedCase = await prisma.case.update({
            where: { id: caseId },
            data: { status: status },
        });

        if (!updatedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // --- Emit Real-time Event ---
        const io = req.app.get('io');
        // Notify the specific case room
        io.to(caseId.toString()).emit('statusUpdate', { caseId, status });
        // Notify the general admin pool
        io.emit('caseUpdate', { message: `Case #${caseId} status manually updated to ${status}.`, case: updatedCase });

        res.json({ message: `Case status updated to ${status}`, case: updatedCase });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCases,
    getDashboardStats,
    updateCaseStatus,
    getCaseDetailsForAdmin,
};
