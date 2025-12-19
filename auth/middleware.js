const { getSession } = require('./session');
const { getTokenFromHeader } = require('./utils');

const requireAuth = async (req, res, next) => {
  const token = getTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json('Unauthorized');
  }

  try {
    const userId = await getSession(token);

    if (!userId) {
      return res.status(401).json('Unauthorized');
    }

    console.log('you shall pass');
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json('Unauthorized');
  }
};

module.exports = {
  requireAuth,
};
