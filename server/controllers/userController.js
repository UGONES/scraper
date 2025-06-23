import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Prevent password update here
    if (updates.password) {
      delete updates.password;
    }

    // If you want to allow partial updates, you could add validation here

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,  // Ensure schema validations run
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// New: Admin-only function to create a new user
export const createUserByAdmin = async (req, res) => {
  const { username, email, password, role } = req.body; // Admin can specify role

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: ['admin', 'user'].includes(role) ? role : 'user', // Ensure role is valid
    });

    res.status(201).json({
      message: 'User created successfully by admin',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Admin create user error:', err.message);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// New: Admin-only function to get a specific user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching single user:', err.message);
    // Handle CastError for invalid IDs
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Server error fetching user' });
  }
};