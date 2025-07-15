const Task = require('../models/Task');
const User = require('../models/User');
const logAction = require('../utils/logAction');

exports.createTask = async (req, res) => {
  const { title, description, status, priority, assignedTo } = req.body;
  const userId = req.user;
  const io = req.app.get('io');

  if (['Todo', 'In Progress', 'Done'].includes(title)) {
    return res.status(400).json({ message: 'Title cannot match column names.' });
  }

  const existing = await Task.findOne({ title: new RegExp(`^${title}$`, 'i') });
  if (existing) {
    return res.status(400).json({ message: 'Task title must be unique.' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      createdBy: userId,
    });

    const logEntry = await logAction({
      userId,
      taskId: task._id,
      actionType: 'CREATE',
      message: `Created task "${task.title}"`
    });

    io.emit('taskCreated', task);
    io.emit('actionLogged', logEntry);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Task creation failed', error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'username email');
  res.status(200).json(tasks);
};

exports.updateTask = async (req, res) => {
  const io = req.app.get('io');

  try {
    const taskId = req.params.id;
    const clientUpdatedAt = req.body.clientUpdatedAt;

    if (!clientUpdatedAt) {
      return res.status(400).json({ message: 'Missing clientUpdatedAt for conflict detection.' });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const serverUpdatedAt = task.updatedAt.toISOString();
    const clientTime = new Date(clientUpdatedAt).toISOString();

    if (clientTime !== serverUpdatedAt) {
      return res.status(409).json({
        message: 'Conflict detected. The task has been modified by another user.',
        serverVersion: task,
        clientVersion: req.body
      });
    }

    const { title, description, status, priority, assignedTo } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();

    const logEntry = await logAction({
      userId: req.user,
      taskId: task._id,
      actionType: 'UPDATE',
      message: `Updated task "${task.title}"`
    });

    io.emit('taskUpdated', task);
    io.emit('actionLogged', logEntry);

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const io = req.app.get('io');

  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    const logEntry = await logAction({
      userId: req.user,
      taskId: req.params.id,
      actionType: 'DELETE',
      message: `Deleted task "${deleted?.title || 'Untitled'}"`
    });

    io.emit('taskDeleted', { taskId: req.params.id });
    io.emit('actionLogged', logEntry);

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

exports.smartAssign = async (req, res) => {
  const io = req.app.get('io');

  try {
    const taskId = req.params.id;

    const users = await User.find();
    if (users.length === 0) return res.status(400).json({ message: 'No users found' });

    const counts = await Promise.all(
      users.map(async (user) => {
        const activeTaskCount = await Task.countDocuments({
          assignedTo: user._id,
          status: { $in: ['Todo', 'In Progress'] }
        });
        return { user, count: activeTaskCount };
      })
    );

    const best = counts.reduce((min, curr) => (curr.count < min.count ? curr : min), counts[0]);

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: best.user._id },
      { new: true }
    ).populate('assignedTo', 'username email');

    const logEntry = await logAction({
      userId: req.user,
      taskId: updatedTask._id,
      actionType: 'ASSIGN',
      message: `Smart assigned task to ${best.user.username}`
    });

    io.emit('taskUpdated', updatedTask);
    io.emit('actionLogged', logEntry);

    res.status(200).json({
      message: `Task assigned to ${best.user.username}`,
      task: updatedTask
    });
  } catch (err) {
    res.status(500).json({ message: 'Smart assign failed', error: err.message });
  }
};
