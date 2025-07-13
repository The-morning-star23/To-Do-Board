const ActionLog = require('../models/ActionLog');

const logAction = async ({ userId, taskId, actionType, message }) => {
  try {
    await ActionLog.create({
      user: userId,
      task: taskId,
      actionType,
      message
    });
  } catch (err) {
    console.error('Failed to log action:', err.message);
  }
};

module.exports = logAction;
