const jwt = require('jsonwebtoken');

const authentification = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }
    let decodedToken = jwt.verify(token, '123456789');
    req.user = decodedToken; // TODO : Get the user from the database

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Le token est expiré.' });
    } else {
      res.status(401).json({ message: 'Le token est invalide.' });
    }
  }
};

module.exports = { authentification };
