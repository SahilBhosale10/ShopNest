const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};


// ===============================
// REGISTER USER
// ===============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires after 10 minutes
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: otp,
      otpExpiry: otpExpiry,
      verified: false
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid user data'
      });
    }

    // Email message
    const message = `
      <h2>Welcome to ShopNest, ${name}!</h2>

      <p>Thank you for registering on our platform.</p>

      <p>Your verification OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP will expire in 10 minutes.</p>

      <p>Please do not share this OTP with anyone.</p>
    `;

    // Send OTP email
    await sendEmail({
      email: user.email,
      subject: 'ShopNest - Email Verification OTP',
      message
    });

    res.status(201).json({
      message: 'Registration successful. OTP sent to your email.',
      email: user.email
    });

  } catch (error) {

    console.error('Registration error:', error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ===============================
// VERIFY OTP
// ===============================
const verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    // Check email and OTP
    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.verified === true) {
      return res.status(400).json({
        message: 'Email already verified'
      });
    }

    // Check OTP
    if (user.otp !== otp.toString()) {
      return res.status(400).json({
        message: 'Invalid OTP'
      });
    }

    // Check OTP expiry
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: 'OTP has expired'
      });
    }

    // Verify user
    user.verified = true;

    // Remove OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // Generate login token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Email verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    });

  } catch (error) {

    console.error('OTP verification error:', error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ===============================
// LOGIN USER
// ===============================
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {

      // Optional: prevent login before email verification
      if (user.verified === false) {
        return res.status(401).json({
          message: 'Please verify your email first'
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });

    } else {

      res.status(401).json({
        message: 'Invalid email or password'
      });

    }

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ===============================
// GET USERS
// ===============================
const getUsers = async (req, res) => {
  try {

    const users = await User
      .find({})
      .select('-password');

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  getUsers
};