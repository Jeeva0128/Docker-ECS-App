const express = require('express');
const { body, param } = require('express-validator');
const taskController = require('../controllers/taskController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

// All task routes are protected
router.use(auth);

router.post(
  '/',
  [
    body('title')
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status value'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
    body('dueDate')
      .optional({ checkFalsy: true, nullable: true })
      .isISO8601().withMessage('Invalid date format')
  ],
  validate,
  taskController.createTask
);

router.get('/', taskController.getTasks);

router.get('/stats', taskController.getTaskStats);

router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID format')
  ],
  validate,
  taskController.getTask
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID format'),
    body('title')
      .optional()
      .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status value'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
    body('dueDate')
      .optional({ checkFalsy: true, nullable: true })
      .isISO8601().withMessage('Invalid date format')
  ],
  validate,
  taskController.updateTask
);

router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID format')
  ],
  validate,
  taskController.deleteTask
);

module.exports = router;
