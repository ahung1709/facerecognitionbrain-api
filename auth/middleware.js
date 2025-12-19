const { getSession } = require('./session');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }

  try {
    const userId = await getSession(authorization);

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
