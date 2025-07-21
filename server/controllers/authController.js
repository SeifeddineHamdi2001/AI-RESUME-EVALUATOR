import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secret } from '../config/jwt.js';

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
      secret,
      { expiresIn: '7d' } // Extended to 7 days
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
      { name: user.name, email: user.email, id: user._id, role: user.role },
      secret,
      { expiresIn: '7d' } // Extended to 7 days
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token (even if expired, we can still get the payload)
    const decoded = jwt.verify(token, secret, { ignoreExpiration: true });
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new token
    const newToken = jwt.sign(
      { name: user.name, email: user.email, id: user._id, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Token refreshed successfully',
      token: newToken,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Refresh Token Error]', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    console.log('[UpdateProfile] req.body:', req.body);
    console.log('[UpdateProfile] req.file:', req.file);
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;
    let updateFields = {};

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      console.log('[UpdateProfile] User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name/email if provided
    if (name) updateFields.name = name;
    if (email && email !== user.email) {
      // Check if new email is already taken
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing && existing._id.toString() !== userId) {
        console.log('[UpdateProfile] Email already in use');
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateFields.email = email.toLowerCase();
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        console.log('[UpdateProfile] Current password required');
        return res.status(400).json({ message: 'Current password required to set new password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        console.log('[UpdateProfile] Current password is incorrect');
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      updateFields.password = await bcrypt.hash(newPassword, 12);
    }

    // Handle profile image if uploaded
    if (req.file && req.file.path) {
      // Store only the relative path for the image
      let relativePath = req.file.path.replace(/\\\\/g, '/').replace(/\\/g, '/');
      const uploadsIndex = relativePath.indexOf('uploads/');
      if (uploadsIndex !== -1) {
        relativePath = relativePath.substring(uploadsIndex);
      }
      updateFields.profileImage = relativePath;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    res.json({ user: updatedUser, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('[Update Profile Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

