import multer from 'multer';
import path from 'path';

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use an absolute path to avoid issues with the working directory
    cb(null, path.resolve(process.cwd(), 'uploads', 'resumes'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('resume');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /pdf|doc|docx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Resumes must be in PDF, DOC, or DOCX format!');
  }
}

// Set up storage engine for profile images
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), 'uploads', 'profile-images'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const profileImageUpload = multer({
  storage: profileImageStorage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    checkImageFileType(file, cb);
  },
}).single('profileImage');

function checkImageFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images must be JPG, JPEG, PNG, or GIF format!');
  }
}

export { profileImageUpload };
export default upload;