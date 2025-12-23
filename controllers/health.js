const { checkRedis } = require('../services/redis');
const { checkPostgres } = require('../services/postgres');

const buildBaseHealth = () => ({
  status: 'ok',
  api: 'ok',
  timestamp: new Date().toISOString(),
});

const ping = (req, res) => {
  res.status(200).json(buildBaseHealth());
};

const basicHealth = (req, res) => {
  res.status(200).json({
    ...buildBaseHealth(),
    service: 'api',
  });
};

const fullHealth = async (req, res) => {
  const result = {
    ...buildBaseHealth(),
    postgres: 'ok',
    redis: 'ok',
  };

  try {
    await checkPostgres();
  } catch {
    result.status = 'degraded';
    result.postgres = 'down';
  }

  try {
    await checkRedis();
  } catch {
    result.status = 'degraded';
    result.redis = 'down';
  }

  res.status(result.status === 'ok' ? 200 : 503).json(result);
};

module.exports = {
  basicHealth,
  fullHealth,
  ping,
};
