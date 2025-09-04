const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();


// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


//SIGN IN API
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    } else if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username should have at least 4 characters" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPass });
    await newUser.save();

    // Send Welcome Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our App 🎉",
      text: `Hello ${username},\n\nWelcome to our platform! Your account has been successfully created.\n\nThanks,\nTeam TaskPilot`,
    });

    return res.status(200).json({
      message: "Sign-up successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Login
router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    
    const token = jwt.sign(
      { id: existingUser._id, username: existingUser.username },  
      "tcmTM",
      { expiresIn: "2d" }
    );

    console.log("Generated Token:", token);
    console.log("Generated Token Payload:", { id: existingUser._id, username: existingUser.username });

    res.status(200).json({ id: existingUser._id, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//verify-email
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const { username, email, password } = verifyToken(token);

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(200).json({
      message: "Email verified successfully! Your account has been created.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;

router.get("/users", async (req, res) => {
  const userId = req.headers.id;
  const user = await User.findById(userId).select("-password");
  res.json(user);
});


router.put("/update-user", async (req, res) => {
  try {
    const userId = req.headers.id; 
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { username, email, password } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    if (username) user.username = username;
    if (email) user.email = email;

    
    if (password) {
      const hashPass = await bcrypt.hash(password, 10);
      user.password = hashPass;
    }

    // Track changes
    let updatedFields = [];
    if (username && username !== user.username) {
      user.username = username;
      updatedFields.push("Username");
    }
    if (email && email !== user.email) {
      user.email = email;
      updatedFields.push("Email");
    }
    if (password && password !== user.password) {
      const hashPass = await bcrypt.hash(password, 10);
      user.password = hashPass;
      updatedFields.push("Password");
    }

    await user.save();

    // Send Email Notification for Profile Update
    if (updatedFields.length > 0) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Account Update Notification",
        text: `Hello ${user.username},\n\nYour account has been updated successfully.\n\n\nThanks,\nTeam TaskPilot`,
      });
    }


    await user.save();
    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});
