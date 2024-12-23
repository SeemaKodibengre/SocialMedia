const express = require("express");
const mongoose = require("mongoose");
const connectMongo=require('./database');
const cors=require('cors')
// connectMongo();

require("dotenv").config();
const path = require('path');

 const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
require('./passport');

const authRoutes = require("./routes/userRoute");
const postRoutes=require('./routes/postRoute')
const app = express();
app.use(cors());
// Middleware
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/posts', express.static(path.join(__dirname, 'posts')));

  app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_TYPES') {
      return res.status(422).json({ error: 'Only JPEG, PNG, and JPG files are allowed!' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(422).json({ error: 'File size must be less than 2MB!' });
    }
    next(err);
  });
// Routes
app.use("/auth", authRoutes);
app.use('/post',postRoutes)

const uri = process.env.MONGO_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('MongoDB connected!');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
