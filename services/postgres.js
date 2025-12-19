const knex = require('knex');

const connectPostgres = () => {
  let connection = null;

  // 1. Docker Compose local Postgres database
  if (process.env.POSTGRES_URI) {
    connection = process.env.POSTGRES_URI;

    // 2. Heroku Postgres OR local development using Heroku DB
  } else if (process.env.DATABASE_URL) {
    connection = {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };

    // 3. No DB configured
  } else {
    throw new Error(
      'ERROR: No database connection string found.' +
        'Expected POSTGRES_URI (Docker) or DATABASE_URL (Heroku).'
    );
  }

  const db = knex({
    client: 'pg',
    connection,
  });

  return db;
};

module.exports = {
  connectPostgres,
};
