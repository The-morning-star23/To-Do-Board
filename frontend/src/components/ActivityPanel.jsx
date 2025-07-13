import React, { useEffect, useState } from 'react';
import socket from '../socket';
import axios from 'axios';

const ActivityPanel = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initial fetch
    axios.get('http://localhost:5000/api/actions?limit=20', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setLogs(res.data.reverse())); // newest last

    // Live updates
    socket.on('actionLogged', (newLog) => {
      setLogs(prev => {
        const updated = [...prev, newLog];
        return updated.slice(-20); // Keep last 20
      });
    });

    return () => socket.off('actionLogged');
  }, []);

  return (
    <div className="w-full sm:w-80 bg-white rounded-xl p-4 shadow-md border h-[80vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">Activity Log</h3>
      <ul className="space-y-3 text-sm text-gray-800">
        {logs.map(log => (
          <li key={log._id} className="border-l-4 pl-3 border-indigo-400 bg-indigo-50 rounded-sm py-1">
            <div className="font-medium">{log.username || 'Someone'} {log.message}</div>
            <div className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityPanel;
