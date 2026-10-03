const taskService = require('../services/taskService');
const { successResponse } = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    successResponse(res, task, 201);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.user._id, req.query);
    successResponse(res, result, 200);
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);
    successResponse(res, task, 200);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    successResponse(res, task, 200);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);
    successResponse(res, { message: 'Task deleted successfully' }, 200);
  } catch (error) {
    next(error);
  }
};

const getTaskStats = async (req, res, next) => {
  try {
    const stats = await taskService.getTaskStats(req.user._id);
    successResponse(res, stats, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats
};
