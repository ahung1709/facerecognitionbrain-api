const { redisClient } = require('../services/redis');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }

  try {
    const reply = await redisClient.get(authorization);

    if (!reply) {
      return res.status(401).json('Unauthorized');
    }

    console.log('you shall pass');
    return next();
  } catch (err) {
    console.error('Authorization error:', err);
    return res.status(401).json('Unauthorized');
  }
};

module.exports = {
  requireAuth,
};
