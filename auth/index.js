const { signToken } = require('./jwt');
const { setSession, getSession, deleteSession } = require('./session');
const { requireAuth } = require('./middleware');
const { getTokenFromHeader } = require('./utils');

const createSession = async (user) => {
  const { email, id } = user;
  const token = signToken(email);

  await setSession(token, id);

  return { success: 'true', userId: id, token };
};

module.exports = {
  createSession,
  deleteSession,
  getSession,
  requireAuth,
  getTokenFromHeader,
};
