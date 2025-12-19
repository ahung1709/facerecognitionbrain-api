const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

require('dotenv').config();

const { connectRedis } = require('./services/redis');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./auth');

// Redis connection
connectRedis()
  .then(() => console.log('Redis ready'))
  .catch(console.error);

// Postgres connection
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
  console.log('ERROR: No database connection string found.');
  console.log('Expected POSTGRES_URI (Docker) or DATABASE_URL (Heroku).');
  process.exit(1);
}

const db = knex({
  client: 'pg',
  connection,
});

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('it is working!');
});
app.post('/signin', signin.signinAuthentication(db, bcrypt));
app.post('/signout', signin.handleSignout);
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});
app.put('/image', auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
