const User = require('../../../main-service/src/models/user');
const Candidate = require('../../../main-service/src/models/candidate');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password_hash -api_key');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ user_id: req.user._id });
    
    res.status(200).json({
      success: true,
      data: candidates
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, getCandidates };