import express from 'express';
import { signup,login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
console.log('authRoutes loaded');
router.post('/login', login);

export default router;
