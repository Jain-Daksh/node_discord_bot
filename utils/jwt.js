const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET, 'JWT_SECRET');
const generateToken = (userId) => {
  const payload = { userId };
  const options = { expiresIn: process.env.expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
};

module.exports = { generateToken, verifyToken, isAuthenticated };
