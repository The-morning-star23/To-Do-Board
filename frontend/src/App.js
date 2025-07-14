import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Board from './pages/Board';
import socket from './socket';

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket:', socket.id);
    });

    socket.on('taskCreated', task => console.log('Task created:', task));
    socket.on('taskUpdated', task => console.log('Task updated:', task));
    socket.on('taskDeleted', ({ taskId }) => console.log('Task deleted:', taskId));
    socket.on('actionLogged', log => console.log('Action logged:', log));

    return () => socket.off();
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
