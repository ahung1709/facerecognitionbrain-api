const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const { connectRedis } = require('./services/redis');
const { connectPostgres } = require('./services/postgres');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./auth');

const app = express();

// Redis connection
connectRedis()
  .then(() => console.log('Redis ready'))
  .catch(console.error);

// Postgres connection
let db;
try {
  db = connectPostgres();
  console.log('Postgres ready');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

// Middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

// Routes
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
