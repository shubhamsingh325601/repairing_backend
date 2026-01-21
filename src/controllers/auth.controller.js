const jwt = require("jsonwebtoken");
const { successResponse, failedResponse, errorResponse } = require("../helpers/apiResponse");
const { encryptPassword, passwordCompare } = require('../helpers/encyptDecrypt');
const { User } = require("../models");
const { jwtSecretKey } = require("../config/keys");

/**
 * @method POST
 * Unified Registration for Users and Agents
 * Expects: { userName, email, name, phone, address, password, role, skills? }
 */
exports.register = async (req, res) => {
  try {
    const { userName, email, name, phone, address, password, role, skills } = req.body;

    // 1. Validate role
    const validRoles = ['user', 'agent'];
    if (!role || !validRoles.includes(role)) {
      return failedResponse(res, "Invalid or missing role. Must be 'user' or 'agent'.", 400);
    }

    // 2. Check if user already exists
    // For agents, we check username too as per your previous logic
    const query = role === 'agent' 
      ? { $or: [{ email }, { phone }, { userName }] } 
      : { $or: [{ email }, { phone }] };

    const existingUser = await User.findOne(query);
    if (existingUser) {
      return failedResponse(res, "Email, phone, or username already registered.", 400);
    }

    // 3. Hash password and save
    const hashedPassword = await encryptPassword(password);
    const newUser = new User({
      userName,
      email,
      name,
      phone,
      address,
      password: hashedPassword,
      role,
      ...(role === 'agent' && { skills }) // Only add skills if agent
    });

    await newUser.save();

    // 4. Generate JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      jwtSecretKey,
      { expiresIn: "7d" }
    );

    // 5. Response Formatting
    const userData = {
      id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      role: newUser.role
    };

    return successResponse(res, { user: userData, token }, `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully.`, 201);
    
  } catch (err) {
    return errorResponse(res, err, "Registration failed.");
  }
};

/**
 * @method POST
 * Unified Login for Users and Agents
 * Expects: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return failedResponse(res, "User not found.", 404);

    const isMatch = await passwordCompare(password, user.password);
    if (!isMatch) return failedResponse(res, "Invalid credentials.", 401);

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      jwtSecretKey, 
      { expiresIn: "7d" }
    );

    // Filter response data based on role
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.role === 'agent' && { 
        skills: user.skills, 
        isAvailable: user.isAvailable, 
        rating: user.rating 
      })
    };

    return successResponse(res, { token, user: userData }, "Login successful.");
  } catch (err) {
    return errorResponse(res, err, "Login failed.");
  }
};