import React, { useEffect, useState } from 'react';
import socket from '../socket';
import axios from 'axios';
import '../styles/activityPanel.css';

const ActivityPanel = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/actions?limit=20`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setLogs(res.data.reverse()));

    socket.on('actionLogged', (newLog) => {
      setLogs((prev) => {
        const updated = [...prev, newLog];
        return updated.slice(-20);
      });
    });

    return () => socket.off('actionLogged');
  }, []);

  return (
    <div className="activity-panel">
      <h3 className="activity-title">Activity Log</h3>
      <ul className="activity-list">
        {logs.map((log) => (
          <li key={log._id} className="activity-item">
            <div className="activity-message">
              {log.username || 'Someone'} {log.message}
            </div>
            <div className="activity-timestamp">
              {new Date(log.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityPanel;
