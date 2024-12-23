const userSchema = require('../models/userSchema');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const passport = require("passport");
const fs = require('fs');
const path = require('path');

const Registration=async(req,res)=>{
    
    const { name, email, password } = req.body;
   
    try {
      const existingUser = await userSchema.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userSchema({ name, email, password: hashedPassword });
  
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const Login=async(req,res)=>{
    const { email, password } = req.body;
  

    try {
      const user = await userSchema.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.send({ message: "Login successful", token , id: user._id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const GoogleLogin = (req, res, next) => {
    // Trigger Google OAuth authentication
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  };

  
  const GoogleCallback = (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/" }, (err, user, info) => {
      if (err) return next(err);
  
      if (!user) {
        return res.redirect("/"); // Redirect back on failure
      }
  
      // Successful authentication
      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  
        return res.redirect(`${process.env.FRONT_END_URL}/register?token=${token}&userId=${user._id}`);
        
      });
    })(req, res, next);
  };
  const User= async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json({
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        bio:user.bio

      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  };
 





const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, bio } = req.body; 
    const profilePic = req.file ? req.file.filename : null;

  

 
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    user.name = name || user.name;
    user.bio = bio || user.bio;
    if (profilePic) {
  
      if (user.profilePic) {
        const oldFilePath = path.join(__dirname, '../uploads', user.profilePic);
       
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }


      user.profilePic = `/uploads/${profilePic}`; 
    }

   
    await user.save();

   
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        bio: user.bio,
        profilePic: user.profilePic, 
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};
  module.exports={Registration,Login,GoogleLogin, GoogleCallback,User,updateUser}