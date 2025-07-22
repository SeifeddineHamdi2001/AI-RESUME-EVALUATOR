import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import connectDB from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    // Allow localhost for local dev
    if (!origin || origin.startsWith('http://localhost')) return callback(null, true);
    // Allow all Vercel preview and production URLs
    if (/^https:\/\/.*vercel\.app$/.test(origin)) return callback(null, true);
    // Otherwise, block
    return callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/evaluate', evaluationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('authRoutes loaded');
  console.log(`Server running on port ${PORT}`);
});