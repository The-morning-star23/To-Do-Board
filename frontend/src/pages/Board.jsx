import React, { useEffect, useState } from 'react';
import Column from '../components/Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import ActivityPanel from '../components/ActivityPanel';

const Board = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setTasks(res.data));
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    const res = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
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
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-100 min-h-screen">
        <div className="flex-1 flex gap-4 overflow-x-auto">
          {columns.map(col => (
            <Column
              key={col}
              title={col}
              tasks={tasks.filter(t => t.status === col)}
              onDropTask={updateTaskStatus}
            />
          ))}
        </div>
        <div className="lg:w-80 w-full">
          <ActivityPanel />
        </div>
      </div>
    </DndProvider>
  );
};

export default Board;
