import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import Otp from "../models/Otp.js";
import nodemailer from "nodemailer";
import "dotenv/config";
export const registerTemp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    await Otp.deleteMany({ email }); // clear old OTPs

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    // Save OTP to DB
    await Otp.create({ email, otp: hashedOtp });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    await transporter.sendMail({
      from: `"Verify OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is: ${otpCode}</h2>`,
    });

    return res.json({
      success: true,
      message: "OTP sent",
      tempUser: { name, email, password },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const otpRecords = await Otp.find({ email });

    let matched = false;
    for (const record of otpRecords) {
      const isMatch = await bcrypt.compare(otp, record.otp);
      if (isMatch) {
        matched = true;
        break;
      }
    }

    if (!matched) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ email }); // Clear OTPs

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Login user: /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({
        success: false,
        message: "email and password are required",
      });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "invalid credentials" });
    }
    if (user.googleId)
      return res.json({
        success: false,
        message:
          'This account was created with Google. Please use "Continue with Google" to sign in.',
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "invalid credentials" });
    }
    console.log("JWT_SECRET is:", process.env.JWT_SECRET);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Fixed typo: was hhtpOnly
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name,avatar:user.avatar },
    });
  } catch (error) {
    console.log("error.message");
    res.json({ success: false, message: "error.message" });
  }
};

// Check auth: api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    // Get userId from req object (set by middleware), not req.body
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout user: /api/user/logout
export const logout = async (_, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "logged out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Google Sign-In Controller: /api/user/google-signin
export const googleSignIn = async (req, res) => {
  try {
    const client = new OAuth2Client(
      "842143909368-bad0eafbd2p2u42uhbncbdam5bdbhfho.apps.googleusercontent.com"
    );
    const { credential } = req.body;

    if (!credential) {
      return res.json({ success: false, message: "No credential provided" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience:
        "842143909368-bad0eafbd2p2u42uhbncbdam5bdbhfho.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.json({
        success: false,
        message: "Email not provided by Google",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name: name || "Google User",
        email,
        password: "google-auth", // Required field, set placeholder for Google users
        googleId,
        avatar: picture,
        isVerified: true, // Google accounts are pre-verified
      });
      await user.save();
    }

    // Generate JWT token

    const token = jwt.sign(
      { id: user._id }, // Changed from userId to id to match your auth middleware
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie (adjust options based on your setup)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      message: "Google sign-in successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
