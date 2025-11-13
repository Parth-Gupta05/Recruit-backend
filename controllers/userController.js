import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

/**
 * Register a new user
 * @route POST /auth/register
 * @body { name, email, password, role, phone }
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "Missing required fields: name, email, password, role",
      });
    }

    // Validate role
    if (!["applicant", "employer"].includes(role)) {
      return res.status(400).json({
        error: "Role must be either 'applicant' or 'employer'",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || null,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Register error:", error.message);
    return res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * Login user
 * @route POST /auth/login
 * @body { email, password }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields: email, password",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        resumeUrl: user.resumeUrl,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return res.status(500).json({ error: "Login failed" });
  }
};

/**
 * Logout user (client-side token removal)
 * @route POST /auth/logout
 */
export const logout = async (req, res) => {
  try {
    // In JWT-based auth, logout is typically handled on the client
    // by removing the token from localStorage/sessionStorage
    // However, we can implement token blacklisting on the server side if needed

    return res.status(200).json({
      message: "Logout successful. Please remove the token from client storage.",
    });
  } catch (error) {
    console.error("❌ Logout error:", error.message);
    return res.status(500).json({ error: "Logout failed" });
  }
};

/**
 * Get current user profile
 * @route GET /auth/profile
 * @headers { Authorization: Bearer token }
 */
export const getProfile = async (req, res) => {
  try {
    // Assumes middleware has set req.user
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        resumeUrl: user.resumeUrl,
      },
    });
  } catch (error) {
    console.error("❌ Get profile error:", error.message);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

/**
 * Update user profile
 * @route PUT /auth/profile
 * @headers { Authorization: Bearer token }
 * @body { name, phone, resumeUrl }
 */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, phone, resumeUrl } = req.body;
    const userId = req.user.userId;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (resumeUrl) updateData.resumeUrl = resumeUrl;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        resumeUrl: updatedUser.resumeUrl,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error.message);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};
