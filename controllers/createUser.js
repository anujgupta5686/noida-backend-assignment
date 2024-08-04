const createUser = require("../models/createUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// User creation (Signup)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, latitude, longitude, status } =
      req.body;

    // Validate required fields
    if (!name || !email || !password || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Please provide all required fields",
      });
    }

    // Check if the user already exists
    let user = await createUser.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "User already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const userInstance = new createUser({
      name,
      email,
      password: hashedPassword,
      address,
      latitude,
      longitude,
      status,
    });

    // Save the user instance to the database
    await userInstance.save();

    // Send success response without JWT token
    res.status(200).json({
      success: true,
      status_code: 200,
      message: "User created successfully",
      data: {
        name: userInstance.name,
        email: userInstance.email,
        address: userInstance.address,
        latitude: userInstance.latitude,
        longitude: userInstance.longitude,
        status: userInstance.status,
        register_at: userInstance.register_at,
      },
    });
  } catch (error) {
    console.error("Error during user creation:", error.message);
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Something went wrong during user creation",
    });
  }
};

// User login
exports.createLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Please provide email and password",
      });
    }

    // Check if the user exists
    let user = await createUser.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Invalid User Please First Signup",
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Invalid Password",
      });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      status_code: 200,
      message: "Login successful",
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        status: user.status,
        register_at: user.register_at,
        token,
      },
    });
  } catch (error) {
    console.error("Error during user login:", error.message);
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Something went wrong during user login",
    });
  }
};
