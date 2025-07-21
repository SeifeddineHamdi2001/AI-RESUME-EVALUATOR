import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes',
    resource_type: 'raw', // for PDFs and other non-image files
    allowed_formats: ['pdf', 'doc', 'docx', 'txt'],
  },
});

const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const uploadResume = multer({ storage: resumeStorage });
const uploadProfileImage = multer({ storage: profileImageStorage });

export { uploadResume, uploadProfileImage };