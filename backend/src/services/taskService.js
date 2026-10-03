const mongoose = require('mongoose');
const Task = require('../models/Task');
const AppError = require('../utils/AppError');

const createTask = async (taskData, userId) => {
  const payload = { ...taskData, userId };
  if (!payload.dueDate) {
    delete payload.dueDate;
  }
  const task = await Task.create(payload);
  return task;
};

const getTasks = async (userId, query) => {
  const { status, priority, search, page = 1, limit = 10 } = query;
  const filter = { userId };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const numPage = Math.max(1, parseInt(page, 10));
  const numLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (numPage - 1) * numLimit;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(numLimit),
    Task.countDocuments(filter)
  ]);

  return {
    tasks,
    pagination: {
      current: numPage,
      pages: Math.ceil(total / numLimit),
      total,
      limit: numLimit
    }
  };
};

const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

const updateTask = async (taskId, userId, updateData) => {
  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
  const updateObj = {};
  
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      if (field === 'dueDate' && !updateData[field]) {
        updateObj[field] = null;
      } else {
        updateObj[field] = updateData[field];
      }
    }
  });

  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { $set: updateObj },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

const getTaskStats = async (userId) => {
  const stats = await Task.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        total: [{ $count: 'count' }],
        pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
        inProgress: [{ $match: { status: 'in-progress' } }, { $count: 'count' }],
        completed: [{ $match: { status: 'completed' } }, { $count: 'count' }],
        highPriority: [{ $match: { priority: 'high' } }, { $count: 'count' }],
        byPriority: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        overdue: [
          { 
            $match: { 
              dueDate: { $lt: new Date() }, 
              status: { $ne: 'completed' } 
            } 
          }, 
          { $count: 'count' }
        ]
      }
    }
  ]);

  const raw = stats[0];
  
  const extractCount = (arr) => (arr && arr.length > 0 ? arr[0].count : 0);

  const priorityCounts = { low: 0, medium: 0, high: 0 };
  raw.byPriority.forEach(p => {
    if (priorityCounts[p._id] !== undefined) {
      priorityCounts[p._id] = p.count;
    }
  });

  return {
    total: extractCount(raw.total),
    pending: extractCount(raw.pending),
    inProgress: extractCount(raw.inProgress),
    completed: extractCount(raw.completed),
    highPriority: extractCount(raw.highPriority),
    byPriority: priorityCounts,
    overdue: extractCount(raw.overdue)
  };
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
};
