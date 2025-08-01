const multer = require('multer');
const path = require('path');

// --- File Type Validation ---
const ALLOWED_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'video/mp4': 'mp4',
  'audio/mpeg': 'mp3', // for mp3 files
  'audio/mp3': 'mp3',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only images, videos, audio, and documents are allowed.'), false); // Reject file
  }
};

// --- Storage Configuration ---
// This config saves files to the local filesystem in the 'uploads' directory.
// For production, consider using a cloud storage solution like AWS S3 or Supabase Storage.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The directory where files will be stored
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// --- Multer Middleware Initialization ---
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20 // 20 MB file size limit
  }
});

module.exports = upload;