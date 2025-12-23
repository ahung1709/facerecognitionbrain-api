const { checkRedis } = require('../services/redis');
const { checkPostgres } = require('../services/postgres');

const basicHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
  });
};

const fullHealth = async (req, res) => {
  const result = {
    status: 'ok',
    api: 'ok',
    postgres: 'ok',
    redis: 'ok',
    timestamp: new Date().toISOString(),
  };

  try {
    await checkPostgres();
  } catch (err) {
    result.status = 'degraded';
    result.postgres = 'down';
  }

  try {
    await checkRedis();
  } catch (err) {
    result.status = 'degraded';
    result.redis = 'down';
  }

  const httpStatus = result.status === 'ok' ? 200 : 503;
  res.status(httpStatus).json(result);
};

const ping = (req, res) => res.sendStatus(200);

module.exports = {
  basicHealth,
  fullHealth,
  ping,
};
