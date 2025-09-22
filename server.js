const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
// Configure multer for profile image uploads
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'profile');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

// Configure multer for project image uploads
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'projects');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

// File filter function
const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF)'));
  }
};

// Create upload middleware for profile and project images
const uploadProfile = multer({ 
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
});

const uploadProject = multer({ 
  storage: projectStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directories exist
const ensureUploadsDir = () => {
  const dirs = [
    path.join(__dirname, 'public', 'uploads'),
    path.join(__dirname, 'public', 'uploads', 'profile'),
    path.join(__dirname, 'public', 'uploads', 'projects')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Call the function to ensure directories exist
ensureUploadsDir();

// Set static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// API Routes
// Handle profile image upload
app.post('/api/upload/profile', uploadProfile.single('profileImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'profile');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Return the full URL to the uploaded file
    const imageUrl = `/uploads/profile/${req.file.filename}`;
    const fullImagePath = path.join(__dirname, 'public', imageUrl);
    
    // Verify the file was saved
    if (!fs.existsSync(fullImagePath)) {
      throw new Error('File was not saved correctly');
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error uploading profile image' 
    });
  }
});

// Handle project image upload
app.post('/api/upload/project', uploadProject.single('projectImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'projects');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Return the full URL to the uploaded file
    const imageUrl = `/uploads/projects/${req.file.filename}`;
    const fullImagePath = path.join(__dirname, 'public', imageUrl);
    
    // Verify the file was saved
    if (!fs.existsSync(fullImagePath)) {
      throw new Error('File was not saved correctly');
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Project image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error uploading project image' 
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to save about content
app.post('/api/about', (req, res) => {
  const { p1, p2 } = req.body;
  // In a real app, you would save this to a database
  console.log('About content updated:', { p1, p2 });
  res.json({ success: true, message: 'About content updated successfully' });
});

// Handle file uploads
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error uploading file' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file was uploaded' 
      });
    }
    
    // File uploaded successfully
    console.log('File uploaded successfully:', req.file);
    res.json({ 
      success: true, 
      message: 'File uploaded successfully',
      path: '/uploads/' + path.basename(req.file.path)
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
