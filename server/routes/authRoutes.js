import express from 'express';
import { signup, login, updateProfile, getMe, refreshToken } from '../controllers/authController.js';
import { uploadProfileImage } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
console.log('authRoutes loaded');
router.post('/login', login);

// Refresh token route
router.post('/refresh-token', refreshToken);

// Profile update route
router.put('/profile', protect, (req, res, next) => {
  uploadProfileImage.single('profileImage')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err });
    }
    next();
  });
}, updateProfile);

// Get current user profile
router.get('/me', protect, getMe);

export default router;
