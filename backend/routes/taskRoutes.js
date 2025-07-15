const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { smartAssign } = require('../controllers/taskController');
const { validateTask } = require('../validators/taskValidator');
const { handleValidation } = require('../middleware/validate');

router.get('/', protect, getAllTasks);

router.post('/', protect, validateTask, handleValidation, createTask);

router.put('/:id/smart-assign', protect, smartAssign);

router.put('/:id', protect, validateTask, handleValidation, updateTask);

router.delete('/:id', protect, deleteTask);

module.exports = router;
