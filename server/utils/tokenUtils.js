const jwt = require('jsonwebtoken');

const generateAccessToken = (email, role) => {
  const payload = {
    email,
    role,
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (email) => {
  return jwt.sign({email}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken };
