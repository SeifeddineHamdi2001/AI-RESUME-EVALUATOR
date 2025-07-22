import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Resume from './models/Resume.js';
import User from './models/User.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Migrate resumes
  const resumeDir = path.join(process.cwd(), 'uploads', 'resumes');
  if (fs.existsSync(resumeDir)) {
    const resumeFiles = fs.readdirSync(resumeDir);
    for (const file of resumeFiles) {
      const filePath = path.join(resumeDir, file);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'resumes',
          resource_type: 'raw',
          type: 'upload', // ensure public access
        });
        // Always update Resume document(s) by originalName
        const updateRes = await Resume.updateMany(
          { originalName: file },
          { $set: { filePath: result.secure_url } }
        );
        console.log(`Migrated resume ${file} to Cloudinary. Updated ${updateRes.modifiedCount} document(s).`);
      } catch (err) {
        console.error(`Failed to migrate resume ${file}:`, err.message);
      }
    }
  }

  // 2. Migrate profile images
  const profileDir = path.join(process.cwd(), 'uploads', 'profile-images');
  if (fs.existsSync(profileDir)) {
    const profileFiles = fs.readdirSync(profileDir);
    for (const file of profileFiles) {
      const filePath = path.join(profileDir, file);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'profile-images',
          resource_type: 'image',
          type: 'upload', // ensure public access
        });
        // Always update User document(s) by filename
        const updateRes = await User.updateMany(
          { profileImage: file },
          { $set: { profileImage: result.secure_url } }
        );
        console.log(`Migrated profile image ${file} to Cloudinary. Updated ${updateRes.modifiedCount} user(s).`);
      } catch (err) {
        console.error(`Failed to migrate profile image ${file}:`, err.message);
      }
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migrate(); 