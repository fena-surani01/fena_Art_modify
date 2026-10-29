const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET || 'fenaria_super_secret_jwt_key_2026_art_studio',
        { expiresIn: '7d' }
    );
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
exports.registerCustomer = async (req, res) => {
    try {
        const { name, email, password, phone_number, address, city, state, zip_code } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required fields.'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        // Create new customer account
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            phone_number: phone_number || '',
            address: address || '',
            city: city || '',
            state: state || '',
            zip_code: zip_code || '',
            role: 'customer',
            is_online: true
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to Fenaria Art Studio.',
            token,
            user
        });
    } catch (error) {
        console.error('Error in registerCustomer:', error);
        const isDbError = error.name === 'MongooseError' || error.name === 'MongoServerSelectionError';
        res.status(isDbError ? 503 : 500).json({
            success: false,
            message: isDbError
                ? 'Database connection timed out. Please make sure your IP is whitelisted (0.0.0.0/0) in MongoDB Atlas.'
                : 'Registration failed due to server error.',
            error: error.message
        });
    }
};

// @desc    Login customer
// @route   POST /api/auth/login
// @access  Public
exports.loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password.'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Update online status
        user.is_online = true;
        await user.save();

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user
        });
    } catch (error) {
        console.error('Error in loginCustomer:', error);
        const isDbError = error.name === 'MongooseError' || error.name === 'MongoServerSelectionError';
        res.status(isDbError ? 503 : 500).json({
            success: false,
            message: isDbError
                ? 'Database connection timed out. Please make sure your IP is whitelisted (0.0.0.0/0) in MongoDB Atlas.'
                : 'Login failed due to server error.',
            error: error.message
        });
    }
};

// @desc    Logout user / clear online status
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        if (req.user && req.user._id) {
            await User.findByIdAndUpdate(req.user._id, { is_online: false });
        }
        res.status(200).json({
            success: true,
            message: 'Logged out successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed.',
            error: error.message
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile.',
            error: error.message
        });
    }
};
