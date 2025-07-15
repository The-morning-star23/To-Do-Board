import React, { useEffect, useState } from 'react';
import socket from '../socket';
import axios from 'axios';
import '../styles/activityPanel.css';

const ActivityPanel = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/actions?limit=20`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setLogs(res.data.reverse()))
      .catch((err) => console.error('Failed to fetch logs:', err));
  };

  useEffect(() => {
    fetchLogs();

    socket.on('actionLogged', (newLog) => {
      if (!newLog || typeof newLog !== 'object') return; // skip null/invalid logs

      setLogs((prev) => {
        const updated = [...prev, newLog];
        return updated.slice(-20);
      });
    });

    return () => socket.off('actionLogged');
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/actions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLogs([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear logs');
    }
  };

  return (
    <div className="activity-panel">
      <div className="activity-header">
        <h3 className="activity-title">Activity Log</h3>
        <button className="clear-log-btn" onClick={handleClearLogs}>
          Clear Logs
        </button>
      </div>
      <ul className="activity-list">
        {logs.map((log) => (
          <li key={log._id || Math.random()} className="activity-item">
            <div className="activity-message">
              {(log?.user?.username || 'Someone')} {log?.message || ''}
            </div>
            <div className="activity-timestamp">
              {log?.createdAt
                ? new Date(log.createdAt).toLocaleString()
                : 'Unknown time'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityPanel;
