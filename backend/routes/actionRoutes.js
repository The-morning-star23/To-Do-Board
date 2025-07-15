const express = require('express');
const router = express.Router();
const { getRecentActions, clearAllLogs } = require('../controllers/actionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecentActions);
router.delete('/', protect, clearAllLogs);

module.exports = router;
