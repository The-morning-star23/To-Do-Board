import React, { useEffect, useState } from 'react';
import Column from '../components/Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import ActivityPanel from '../components/ActivityPanel';
import TaskModal from '../components/TaskModal';
import '../styles/board.css';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setTasks(res.data);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
      {
        status: newStatus,
        clientUpdatedAt: new Date().toISOString(),
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
    setTasks(prev =>
      prev.map(t => (t._id === taskId ? { ...t, ...res.data } : t))
    );
  };

  const handleTaskSubmit = async (formData, taskId) => {
    try {
      if (taskId) {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
          {
            ...formData,
            clientUpdatedAt: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setTasks(prev =>
          prev.map(t => (t._id === taskId ? { ...t, ...res.data } : t))
        );
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/tasks`,
          formData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setTasks(prev => [...prev, res.data]);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/smart-assign`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      const updated = res.data.task;
      setTasks(prev =>
        prev.map(t => (t._id === updated._id ? { ...t, ...updated } : t))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Smart assign failed');
    }
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
              onSmartAssign={handleSmartAssign}
              onEditTask={setEditingTask}
            />
          ))}
        </div>
        <div className="activity-panel-container">
          <ActivityPanel />
        </div>

        <button
          className="add-task-button"
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
        >
          + Add Task
        </button>

        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleTaskSubmit}
          initialData={editingTask || {}}
        />
      </div>
    </DndProvider>
  );
};

export default Board;
