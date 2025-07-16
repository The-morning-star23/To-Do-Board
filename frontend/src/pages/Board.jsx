import React, { useEffect, useState } from 'react';
import Column from '../components/Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import ActivityPanel from '../components/ActivityPanel';
import TaskModal from '../components/TaskModal';
import Navbar from '../components/Navbar';
import '../styles/board.css';
import socket from '../socket';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();

    socket.on('taskCreated', (newTask) => {
      setTasks((prev) => {
        const exists = prev.find((t) => t._id === newTask._id);
        if (exists) return prev;
        return [...prev, newTask];
      });
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on('taskDeleted', ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        {
          status: newStatus,
          clientUpdatedAt:
            tasks.find((t) => t._id === taskId)?.updatedAt ||
            new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Immediate local update (WebSocket will also update all tabs)
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...res.data } : t))
      );
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleTaskSubmit = async (formData, taskId) => {
    try {
      if (taskId) {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
          {
            ...formData,
            clientUpdatedAt:
              tasks.find((t) => t._id === taskId)?.updatedAt ||
              new Date().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, ...res.data } : t))
        );
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/tasks`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setTasks((prev) => [...prev, res.data]);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/smart-assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const updated = res.data.task;
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? { ...t, ...updated } : t))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Smart assign failed');
    }
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <DndProvider backend={HTML5Backend}>
      <Navbar />
      <div className="board-container">
        <div className="board-columns">
          {columns.map((col) => (
            <Column
              key={col}
              title={col}
              tasks={tasks.filter((t) => t.status === col)}
              onDropTask={updateTaskStatus}
              onSmartAssign={handleSmartAssign}
              onEditTask={(task) => {
                setEditingTask(task);
                setModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
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
