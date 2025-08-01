const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

// --- Helper Function to Generate JWT ---
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};


/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
    // --- Input Validation ---
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, age, gender, photo_url, address_street, address_city, address_zip } = req.body;

    try {
        // --- Check if user already exists ---
        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // --- Hash the password ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- Create user in the database ---
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                age: age ? parseInt(age) : null,
                gender,
                photo_url,
                address_street,
                address_city,
                address_zip,
                // By default, role is 'USER' as defined in schema
            },
        });

        // --- Respond with user data and token ---
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        next(error); // Pass error to the centralized error handler
    }
};


/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // --- Find user by email ---
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // --- Check if user exists and if password matches ---
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
    try {
        // The user object is attached to the request by the `protect` middleware
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                age: true,
                gender: true,
                photo_url: true,
                address_street: true,
                address_city: true,
                address_zip: true,
                role: true,
                created_at: true,
            }
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};
