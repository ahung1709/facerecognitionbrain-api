const {
  createSession,
  getSession,
  deleteSession,
  getTokenFromHeader,
} = require('../auth');

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
        return Promise.reject('wrong credentials');
      }
    })
    .catch((err) => Promise.reject('wrong credentials'));
};

const getAuthTokenId = async (req, res) => {
  const token = getTokenFromHeader(req.headers.authorization);

  try {
    const reply = await getSession(token);

    if (!reply) {
      return res.status(400).json('Unauthorized');
    }

    return res.json({ id: reply });
  } catch (err) {
    return res.status(400).json('Unauthorized');
  }
};

const signinAuthentication = (db, bcrypt) => async (req, res) => {
  const token = getTokenFromHeader(req.headers.authorization);

  try {
    if (token) {
      return getAuthTokenId(req, res);
    }

    const user = await handleSignin(db, bcrypt, req, res);

    const session = await (user.id && user.email
      ? createSession(user)
      : Promise.reject(user));

    return res.json(session);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const handleSignout = async (req, res) => {
  const token = getTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(400).json('No token provided');
  }

  try {
    await deleteSession(token);
    return res.json({ success: 'true' });
  } catch (err) {
    console.error('Signout error:', err);
    return res.status(400).json('unable to sign out');
  }
};

module.exports = {
  signinAuthentication,
  handleSignout,
};
