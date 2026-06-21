const express = require('express');
const router = express.Router();
const { registerUser, loginUser, adminCreateUser } = require('../controllers/Auth.controller');
const { protect, authorizeRoles } = require('../middleware/protect');

 
router.post('/register', registerUser);
router.post('/login', loginUser);

 
router.post('/admin/create-user', protect, authorizeRoles('admin'), adminCreateUser);

module.exports = router;