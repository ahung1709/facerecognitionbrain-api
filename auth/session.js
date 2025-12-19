const { redisClient } = require('../services/redis');

const setSession = async (token, userId) => {
  await redisClient.set(token, userId);
};

const getSession = async (token) => {
  return await redisClient.get(token);
};

const deleteSession = async (token) => {
  await redisClient.del(token);
};

module.exports = {
  setSession,
  getSession,
  deleteSession,
};
