const jwt = require('jsonwebtoken');

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
};

module.exports = {
  signToken,
};
