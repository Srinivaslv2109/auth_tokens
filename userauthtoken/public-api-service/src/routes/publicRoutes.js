const express = require('express');
const { getProfile, getCandidates } = require('../controllers/publicController');
const { apiKeyAuth } = require('../middleware/apiAuth');

const router = express.Router();

router.get('/public/profile', apiKeyAuth, getProfile);
router.get('/public/candidate', apiKeyAuth, getCandidates);

module.exports = router;