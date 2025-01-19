const express = require('express');
const { addCandidate, getCandidates } = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/candidate', protect, addCandidate);
router.get('/candidate', protect, getCandidates);

module.exports = router;
