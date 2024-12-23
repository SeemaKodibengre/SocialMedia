const {Registration, Login, GoogleCallback, GoogleLogin, User, updateUser} = require('../controllers/userController');
const express = require('express');
const router = express.Router();
const Protect = require('../middleware/authMidleware');
const multer = require('multer');
const path=require('path')



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); 
  },
  filename: (req, file, cb) => {
    const newName = `UserPic_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, newName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only JPEG, PNG, and JPG files are allowed!');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 2MB
  },
});



const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

router.post('/register', Registration);
router.post('/login', Login);

router.get("/google", GoogleLogin);
router.get("/google/callback", GoogleCallback);
router.get('/user', Protect, User);
router.put('/update/:id', upload.single('profilePic'), updateUser);

module.exports = router;
