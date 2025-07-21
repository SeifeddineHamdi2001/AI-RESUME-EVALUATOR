import jwt from 'jsonwebtoken';
import { secret } from '../config/jwt.js';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Access denied. No token provided or invalid format.' });

  const token = authHeader.split(' ')[1];
  if (!token || token.trim() === '') {
    return res.status(401).json({ message: 'Empty token provided' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded.id) {
      return res.status(400).json({ message: 'Invalid token structure: missing user ID' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token signature' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Token not active' });
    } else {
      return res.status(403).json({ message: 'Token verification failed' });
    }
  }
};