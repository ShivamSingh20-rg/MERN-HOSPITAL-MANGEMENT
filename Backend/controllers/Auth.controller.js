const User = require('../models/User.model')
const configs = require('../configs')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 

const generateToken = (id) => {
  return jwt.sign({ id }, configs.JWT_SECRET, { expiresIn: '4d' });
};

 
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
 
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "This email is already registered." });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

 
    const user = await User.create({
      name,
      email,
      password: hashedPassword  
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Trace user by unique email property
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password credentials." });
    }

    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid email or password credentials." });
    }

     
    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['doctor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: "Admin can only provision doctor or admin roles." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStaff = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: `Staff account [${role}] generated successfully.`,
      data: { id: newStaff._id, name: newStaff.name, email: newStaff.email, role: newStaff.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminCreateUser
};