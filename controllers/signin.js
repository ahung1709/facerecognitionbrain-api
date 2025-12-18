const jwt = require('jsonwebtoken');
const { redisClient } = require('../services/redis');

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => user[0])
          .catch((err) => Promise.reject('unable to get user'));
      } else {
        Promise.reject('wrong credentials');
      }
    })
    .catch((err) => Promise.reject('wrong credentials'));
};

const getAuthTokenId = async (req, res) => {
  const { authorization } = req.headers;

  try {
    const reply = await redisClient.get(authorization);

    if (!reply) {
      return res.status(400).json('Unauthorized');
    }

    return res.json({ id: reply });
  } catch (err) {
    return res.status(400).json('Unauthorized');
  }
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token };
    })
    .catch(console.log);
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
        .then((data) => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

const handleSignout = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json('No token provided');
  }

  try {
    await redisClient.del(authorization);
    return res.json({ success: 'true' });
  } catch (err) {
    console.error('Signout error:', err);
    return res.status(400).json('unable to sign out');
  }
};

module.exports = {
  signinAuthentication,
  handleSignout,
  createSessions,
};
