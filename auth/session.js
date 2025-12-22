const {
  redisClient,
  connectRedis,
  getRedisClient,
} = require('../services/redis');

const setSession = async (token, userId) => {
  await connectRedis();
  const redis = getRedisClient();
  await redis.set(token, userId);
};

const getSession = async (token) => {
  await connectRedis();
  const redis = getRedisClient();
  return await redis.get(token);
};

const deleteSession = async (token) => {
  await connectRedis();
  const redis = getRedisClient();
  await redis.del(token);
};

module.exports = {
  setSession,
  getSession,
  deleteSession,
};
