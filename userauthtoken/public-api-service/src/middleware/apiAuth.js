const User = require('../../../main-service/src/models/user');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ success: false, message: 'API key is required' });
  }

  try {
    const user = await User.findOne({ api_key: apiKey });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid API key' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = { apiKeyAuth };
