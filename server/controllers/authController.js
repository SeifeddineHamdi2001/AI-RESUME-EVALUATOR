import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase();

  console.log('[Signup Request]', { name, email: normalizedEmail, password, role });

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    console.log('[Existing User Check]', existingUser);

    if (existingUser) {
      console.warn('[Signup] Email already exists');
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    console.log('[User Created]', user);

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('[Token Generated]', token);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('[Signup Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req, res) => {
  console.log('[Login Request Body]', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });
    

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

