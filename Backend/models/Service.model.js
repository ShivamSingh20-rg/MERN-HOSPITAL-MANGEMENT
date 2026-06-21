const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },      
  fee: { type: String, required: true },   
  duration:{type: Number ,required: true},     
  specifications:{type: [String], // Defines it explicitly as an array containing strings
  default: []},     
  image: { type: String, required: true }
}, { timestamps: true });


const Service =  mongoose.model('Service', ServiceSchema);
module.exports =Service;