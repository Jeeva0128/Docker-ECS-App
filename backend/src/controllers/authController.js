const authService = require('../services/authService');
const { successResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    successResponse(res, result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    successResponse(res, result, 200);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user is already populated by auth middleware
    const user = authService.formatUser(req.user);
    successResponse(res, user, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
