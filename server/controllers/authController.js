import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/user.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({success:false, message: "Please fill all fields" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({success:false, message: "Please enter a valid email address" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({success:false, message: "Password must be at least 6 characters" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({success:false, message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      global.userData = {
        name:user.name,
        email: user.email,
        id: user._id,
      }

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        token,
        user,
      });
    } else {
      return res.status(400).json({success:false, message: "Invalid user data" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({success:false, message: "Please fill all fields" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({success:false, message: "Please enter a valid email address" });
    }
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      global.userData = {
        name:user.name,
        email: user.email,
        id: user._id,
      }

      res.status(201).json({
        success: true,
        message: "User login successfully",
        token,
        user,
      });
    } else {
      res.status(400).json({success:false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    global.userData = {
      name:user.name,
      email: user.email,
      id: user._id,
    }

    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, checkAuth };