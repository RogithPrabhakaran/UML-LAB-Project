// controllers/userController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const sequelize = require('../../db');
const User = require('../models/userModel');
const { Op } = require('sequelize'); // Fix: Import Op correctly

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'default_secret';

/**
 * User Signup Controller
 * Registers a new user in the system
 */
exports.signup = async (req, res) => {
  const { username, emailId, password, fullName, bio, preferences } = req.body; // Fix: Added bio and preferences

  // Basic validation
  if (!username || !emailId || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { emailId }] }, // Fix: Use Op.or correctly
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      username,
      emailId,
      passwordHash,
      fullName,
      bio: bio || '', // Fix: Provide default value if bio is undefined
      preferences: preferences || '', // Fix: Provide default value if preferences is undefined
      role: 'user', // Default role
      accountStatus: 'active', // Default account status
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.userId, username: newUser.username },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        userId: newUser.userId,
        username: newUser.username,
        emailId: newUser.emailId,
        fullName: newUser.fullName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Login User Controller
 * Authenticates a user and returns a JWT token
 */
exports.login = async (req, res) => {
  const { emailId, password } = req.body;

  // Basic validation
  if (!emailId || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { emailId } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        userId: user.userId,
        username: user.username,
        emailId: user.emailId,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Get User by ID
 */
exports.getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get User error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Update User
 */
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, emailId, fullName, password, bio, preferences } = req.body; // Fix: Added bio and preferences

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (emailId) user.emailId = emailId;
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (preferences) user.preferences = preferences;

    if (password) {
      const saltRounds = 10;
      user.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully.',
      user: {
        userId: user.userId,
        username: user.username,
        emailId: user.emailId,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('Update User error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Delete User
 */
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.destroy();

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete User error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
