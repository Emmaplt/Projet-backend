const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Request Headers:', req.headers);

  try {
    if (!req.headers.authorization) {
      console.log('Authorization header is missing');
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = req.headers.authorization.split(' ')[1];
    console.log('Token reçu:', token);

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};