const getTokenFromHeader = (authorization) => {
  if (!authorization) return null;

  const parts = authorization.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) return null;

  return parts[1];
};

module.exports = {
  getTokenFromHeader,
};
