const dotenv = require('dotenv');  

dotenv.config();

const configs = {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URL: process.env.MONGO_URL,
   RAZORPAY_ID: process.env.RAZORPAY_ID,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET
};

module.exports = configs;  