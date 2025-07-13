const { body } = require('express-validator');

exports.validateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title too long'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description too long'),
  body('status')
    .isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid status'),
  body('priority')
    .isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
];
