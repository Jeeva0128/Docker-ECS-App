const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { errorResponse } = require('../utils/response');

const auth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Not authorized to access this route. Missing token.', 401);
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return errorResponse(res, 'The user belonging to this token no longer exists.', 401);
      }
      
      next();
    } catch (err) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
