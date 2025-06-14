// server/controllers/authControllers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res) {
  const { username, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: ['admin', 'user'].includes(role) ? role : 'user',
    });

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Error registering user' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email:user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login error' });
  }
}
