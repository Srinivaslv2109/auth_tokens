const express = require('express');
const { register, login, protected } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/protected', protect, protected);

module.exports = router;