const jwt = require("jsonwebtoken")
const { successResponse, failedResponse, errorResponse } = require("../helpers/apiResponse")
const { encryptPassword, passwordCompare } = require('../helpers/encyptDecrypt')
const { User,Agent } = require("../models")
const { jwtSecretKey, senderEmail } = require("../config/keys")
const { transporter } = require("../config/email.config")

// ------------------ USER ------------------ //

/**
 * @method POST
 * Registers a new user
 */
exports.registerUser = async (req, res) => {
  try {
    const { userName, email, name, phone, address, password } = req.body;
    // 1. Check if user exists by email or phone
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return failedResponse(res, "Email or phone number already registered.", 400);
    }

    // 2. Hash password
    const hashedPassword = await encryptPassword(password);

    // 3. Create user with default role
    const newUser = new User({
      userName,
      email,
      name,
      phone,
      address,
      password: hashedPassword,
    });

    await newUser.save();

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      jwtSecretKey,
      { expiresIn: "7d" }
    );

    // 5. Prepare user data to return (excluding password)
    const userData = {
      id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      address: newUser.address,
      role: "user"
    };

    // 6. Send success response with token and user data
    return successResponse(res, [{ application: userData, token }], "User registered successfully.", 201);
    
  } catch (err) {
    console.error(err)
    return errorResponse(res, err, "Registration failed.");
  }
};

/**
 * @method POST
 * Logs in a user
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) return failedResponse(res, "User not found.", 404);

    const isMatch = await passwordCompare(password, existingUser.password);
    if (!isMatch) return failedResponse(res, "Invalid credentials.", 401);

    const token = jwt.sign({ id: existingUser._id, role: "user" }, jwtSecretKey, { expiresIn: "7d" });

    const userData = {
      id: existingUser._id,
      userName: existingUser.userName,
      email: existingUser.email,
      name: existingUser.name,
      phone: existingUser.phone,
      address: existingUser.address,
    };

    return successResponse(res, { token, user: userData }, "Login successful.");
  } catch (err) {
    console.log(err)
    return errorResponse(res, err, "Login failed.");
  }
};

// ------------------ AGENT ------------------ //

/**
 * @method POST
 * Registers a new agent
 */
exports.registerAgent = async (req, res) => {
  try {
    const { name, email, phone, password, address, skills } = req.body;

    const existingAgent = await Agent.findOne({ $or: [{ email }, { phone }] });
    if (existingAgent) {
      return failedResponse(res, "Email or phone number already registered.", 400);
    }

    const hashedPassword = await encryptPassword(password);

    const newAgent = new Agent({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      skills,
    });

    await newAgent.save();

    return successResponse(res, null, "Agent registered successfully.", 201);
  } catch (err) {
    return errorResponse(res, err, "Agent registration failed.");
  }
};

/**
 * @method POST
 * Logs in an agent
 */
exports.loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAgent = await Agent.findOne({ email });
    if (!existingAgent) return failedResponse(res, "Agent not found.", 404);

    const isMatch = await comparePassword(password, existingAgent.password);
    if (!isMatch) return failedResponse(res, "Invalid credentials.", 401);

    const token = jwt.sign({ id: existingAgent._id, role: "agent" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const agentData = {
      id: existingAgent._id,
      name: existingAgent.name,
      email: existingAgent.email,
      phone: existingAgent.phone,
      address: existingAgent.address,
      skills: existingAgent.skills,
      isAvailable: existingAgent.isAvailable,
      rating: existingAgent.rating
    };

    return successResponse(res, { token, agent: agentData }, "Login successful.");
  } catch (err) {
    return errorResponse(res, err, "Login failed.");
  }
};

/**
 * @method POST
 * Send OTP functionality
 */
exports.sendOTP = async (req, res) => {
  const { contact } = req.body;

  const otp = generateOTP();

  try {
    if (contact.includes('@')) {
      await sendEmailOTP(contact, otp);
    } else {
      await sendSMSOTP(contact, otp);
    }

    storeOTP(contact, otp);

    // In production, do not send the OTP back in the response
    res.json({ message: 'OTP sent successfully', otp }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

/**
 * @method POST
 * Verify OTP functionality
 */
exports.verifyOTP = async (req, res) => {
  const { contact, otp } = req.body;

  if (!contact || !otp) {
    return res.status(400).json({ error: 'Contact and OTP are required' });
  }

  const isValid = verifyStoredOTP(contact, otp);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  res.json({ message: 'OTP verified successfully' });
};

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Email
const sendEmailOTP = async (email, otp) => {
  const mailOptions = {
    from: senderEmail,
    to: email,
    subject: 'Welcome!',
    text: `Please use OTP: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email successfully sent:', info.response);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};

// Send OTP via SMS
const sendSMSOTP = async (phone, otp) => {
  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};

const otpStore = new Map(); 

function storeOTP(contact, otp) {
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(contact, { otp, expiresAt });
}

function verifyStoredOTP(contact, otp) {
  const entry = otpStore.get(contact);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(contact);
    return false;
  }

  const isValid = entry.otp === otp;
  if (isValid) otpStore.delete(contact);
  return isValid;
}