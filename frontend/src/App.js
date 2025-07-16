import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Board from './pages/Board';
import socket from './socket';

function App() {
  useEffect(() => {
    const onConnect = () => console.log('Connected to WebSocket:', socket.id);
    const onTaskCreated = (task) => console.log('Task created:', task);
    const onTaskUpdated = (task) => console.log('Task updated:', task);
    const onTaskDeleted = ({ taskId }) => console.log('Task deleted:', taskId);
    const onActionLogged = (log) => console.log('Action logged:', log);

    socket.on('connect', onConnect);
    socket.on('taskCreated', onTaskCreated);
    socket.on('taskUpdated', onTaskUpdated);
    socket.on('taskDeleted', onTaskDeleted);
    socket.on('actionLogged', onActionLogged);

    return () => {
      socket.off('connect', onConnect);
      socket.off('taskCreated', onTaskCreated);
      socket.off('taskUpdated', onTaskUpdated);
      socket.off('taskDeleted', onTaskDeleted);
      socket.off('actionLogged', onActionLogged);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
