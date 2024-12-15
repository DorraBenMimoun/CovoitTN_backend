const jwt = require('jsonwebtoken');
const User = require('../models/utilisateur.model');


const authentification = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("hello");

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }
    let decodedToken = jwt.verify(token, '123456789');
    req.user = await User.findOne({ _id: decodedToken?.id });

    if (!req.user) {
      
      return res.status(401).json({ message: "Please authenticate again " });
    }
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
