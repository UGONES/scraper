import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  console.log('[DEBUG] Received register body:', req.body);
  const { username, fullName, email, password, role } = req.body;

  if (!username || !email || !password || !fullName) {
    console.log('[DEBUG] Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('[DEBUG] User already exists:', existing.email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[DEBUG] Hashed password:', hashedPassword);

    const newUser = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
      role: ['admin', 'user'].includes(role) ? role : 'user',
    });

    console.log('[DEBUG] New user created:', newUser._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('[Register Error]', err.message);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req, res) => {
  console.log('[DEBUG] Login body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('[DEBUG] Email or password missing');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    console.log('[DEBUG] Found user:', user);

    if (!user) {
      console.log('[DEBUG] No user found with that email');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[DEBUG] Password match:', isMatch);

    if (!isMatch) {
      console.log('[DEBUG] Incorrect password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const safeRole = ['admin', 'user'].includes(user.role) ? user.role : 'user';
    const tokenPayload = {
      userId: user._id.toString(),
      role: safeRole,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('[DEBUG] Token payload:', tokenPayload);
    console.log('[DEBUG] JWT Secret present:', !!process.env.JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('[Login Error]', err.message);
    res.status(500).json({ message: 'Login error' });
  }
};
