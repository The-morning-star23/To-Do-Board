import React, { useEffect, useState } from 'react';
import Column from '../components/Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import ActivityPanel from '../components/ActivityPanel';
import '../styles/board.css';

const Board = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setTasks(res.data));
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, {
      status: newStatus,
      clientUpdatedAt: new Date().toISOString(),
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    setTasks(prev =>
      prev.map(t => (t._id === taskId ? { ...t, ...res.data } : t))
    );
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board-container">
        <div className="board-columns">
          {columns.map(col => (
            <Column
              key={col}
              title={col}
              tasks={tasks.filter(t => t.status === col)}
              onDropTask={updateTaskStatus}
            />
          ))}
        </div>
        <div className="activity-panel-container">
          <ActivityPanel />
        </div>
      </div>
    </DndProvider>
  );
};

export default Board;
