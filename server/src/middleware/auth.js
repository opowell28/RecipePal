/*
 * Verifies user is logged in
 * Ensures users can only see, edit, and delete their own recipes

 * Example flow:
 * User logs in → Gets token
 * User creates recipe → Sends token in header
 * Middleware checks token → Extracts userId
 * Recipe gets created with that userId
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;