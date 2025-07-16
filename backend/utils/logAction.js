const ActionLog = require('../models/ActionLog');

const logAction = async ({ userId, taskId, actionType, message }) => {
  try {
    const log = await ActionLog.create({
      user: userId,
      task: taskId,
      actionType,
      message
    });

    return await log.populate([
      { path: 'user', select: 'username' },
      { path: 'task', select: 'title' }
    ]);
  } catch (err) {
    console.error('Failed to log action:', err.message);
    return null;
  }
};

module.exports = logAction;
