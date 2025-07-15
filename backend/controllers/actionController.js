const ActionLog = require('../models/ActionLog');

exports.getRecentActions = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  try {
    const logs = await ActionLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'username')
      .populate('task', 'title');

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch actions', error: err.message });
  }
};

exports.clearAllLogs = async (req, res) => {
  try {
    await ActionLog.deleteMany({});
    res.status(200).json({ message: 'All logs cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear logs', error: err.message });
  }
};
