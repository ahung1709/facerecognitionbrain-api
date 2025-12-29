const knex = require('knex');

let db = null;

const connectPostgres = () => {
  if (db) return db;

  let connection;

  // 1. Docker Compose local Postgres database
  if (process.env.POSTGRES_URI) {
    connection = process.env.POSTGRES_URI;

    // 2. Production Neon Postgres OR local development using Neon DB
  } else if (process.env.NEON_DATABASE_URL) {
    connection = {
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };

    // 3. No DB configured
  } else {
    throw new Error(
      'ERROR: No database connection string found.' +
        'Expected POSTGRES_URI (Docker) or NEON_DATABASE_URL (Neon).'
    );
  }

  db = knex({
    client: 'pg',
    connection,
  });

  return db;
};

const checkPostgres = async () => {
  const db = connectPostgres();
  await db.raw('SELECT 1');
};

module.exports = {
  connectPostgres,
  checkPostgres,
};
