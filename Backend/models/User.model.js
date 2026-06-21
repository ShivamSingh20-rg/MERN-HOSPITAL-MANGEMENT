const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['patient', 'doctor', 'admin'], 
    default: 'patient' 
  }
}, { timestamps: true });

const User = mongoose.model('user', UserSchema);
module.exports = User;