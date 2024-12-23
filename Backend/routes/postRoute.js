const express = require("express");
const router = express.Router();

const multer = require("multer");
const {createPost, viewPostById, viewPost, postLike, postUnlike}=require('../controllers/postController')

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "posts/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}); 
const fs = require('fs');
if (!fs.existsSync('./posts')) {
  fs.mkdirSync('./posts');
}
// POST: Create a new post
router.post("/create", upload.single("file"),createPost);
router.get("/view", viewPostById);
router.get("/viewAll", viewPost);
router.post('/like/:postId',postLike);
router.post('/unlike/:postId',postUnlike)
module.exports=router;