const jwt = require("jsonwebtoken")
const { successResponse, failedResponse, errorResponse } = require("../helpers/apiResponse")
const { encryptPassword, passwordCompare } = require('../helpers/encyptDecrypt')
const { User } = require("../models")
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
    const { userName, name, email, phone, password, address, skills } = req.body;

    const existingAgent = await User.findOne({ $or: [{ email }, { phone }, { userName }], role: 'agent' });
    if (existingAgent) {
      return failedResponse(res, "Email, phone number, or username already registered.", 400);
    }

    const hashedPassword = await encryptPassword(password);

    const newAgent = new User({
      userName,
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      skills,
      role: 'agent'
    });

    await newAgent.save();

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: newAgent._id, role: newAgent.role },
      jwtSecretKey,
      { expiresIn: "7d" }
    );

    // 5. Prepare user data to return (excluding password)
    const agentData = {
      id: newAgent._id,
      userName: newAgent.userName,
      email: newAgent.email,
      name: newAgent.name,
      phone: newAgent.phone,
      address: newAgent.address,
      role: "agent"
    };

    return successResponse(res, [{ application: agentData, token }], "Agent registered successfully.", 201);
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

    const existingAgent = await User.findOne({ email, role: 'agent' });
    if (!existingAgent) return failedResponse(res, "Agent not found.", 404);

    const isMatch = await passwordCompare(password, existingAgent.password);
    if (!isMatch) return failedResponse(res, "Invalid credentials.", 401);

    const token = jwt.sign({ id: existingAgent._id, role: "agent" }, jwtSecretKey, { expiresIn: "7d" });

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

   return successResponse(res, { token, user: agentData }, "Login successful.");
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

  try {
    const otp = await handleOTPSend(contact);

    //  In production, don't send OTP back in the response
    res.json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

/**
 * @method POST
 * Email Verify functionality
 */
exports.emailVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Send OTP for verification as part of the flow
    await handleOTPSend(email);

    const existingEmail = await User.findOne({ email });

    if (!existingEmail) {
      const newEmail = new User({ email: email, userName: email.split('@')[0] });
      await newEmail.save();
    }

    return res
      .status(201)
      .json({ success: true, message: "Email verification OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

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
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const user = await User.findOne(
  { email: contact },
  { _id: 1, role: 1 } // include only _id and role fields
);



  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    jwtSecretKey,
    { expiresIn: "7d" }
  );


  res.status(200).json({
    success: true,
    data: {
      token:token,
      role: user.role ?? ""
    }, 
    message: 'OTP verified successfully' });
};

// =============================================================
// Centralized OTP Handling Function
// =============================================================

/**
 * Generate, send, and store OTP for email or phone
 * @param {string} contact - email or phone number
 */
async function handleOTPSend(contact) {
  const otp = generateOTP();

  try {
    if (contact.includes("@")) {
    console.log(contact,"lllll");

      await sendEmailOTP(contact, otp);
    } else {
      await sendSMSOTP(contact, otp);
    }

    storeOTP(contact, otp);

    return otp; // Return OTP (for logging or test mode only)
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("OTP sending failed");
  }
}


// =============================================================
// Supporting functions (same as before)
// =============================================================

// Generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Email
const sendEmailOTP = async (email, otp) => {
  const mailOptions = {
    from: senderEmail,
    to: "shubham.singh325601@gmail.com",
    subject: "Welcome!",
    text: `Please use OTP: ${otp}`,
  };

  try {
    console.log(senderEmail,"sender")
    const info = await transporter.sendMail(mailOptions);
    console.log("Email successfully sent:", info.response);
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
};

// Send OTP via SMS
const sendSMSOTP = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log("SMS successfully sent to:", phone);
  } catch (err) {
    console.error("Failed to send SMS:", err);
    throw err;
  }
};

// Temporary in-memory OTP store
const otpStore = new Map();

function storeOTP(contact, otp) {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
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