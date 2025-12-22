const { createClient } = require('redis');

let redisClient = null;

const connectRedis = async () => {
  if (redisClient && redisClient.isOpen) return redisClient;

  redisClient = createClient({
    url: process.env.REDIS_URI,
  });

  redisClient.on('connect', () => {
    console.log('Redis connected');
  });

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  await redisClient.connect();
  return redisClient;
};

const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    throw new Error('Redis client is not connected.');
  }
  return redisClient;
};

const checkRedis = async () => {
  const redis = await connectRedis();
  await redis.ping();
};

module.exports = {
  connectRedis,
  getRedisClient,
  checkRedis,
};
