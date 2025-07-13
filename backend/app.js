const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// define routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const actionRoutes = require('./routes/actionRoutes');
app.use('/api/actions', actionRoutes);

const rateLimiter = require('./middleware/rateLimiter');
app.use(rateLimiter);

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
