import React, { useState, useEffect } from 'react';
import '../styles/task-modal.css';
import axios from 'axios';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
  });

  const [conflict, setConflict] = useState(null); // holds conflict info

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Todo',
      });
    }
    setConflict(null);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initialData._id) {
      // Create mode
      onSubmit(form);
      onClose();
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${initialData._id}`, {
        ...form,
        clientUpdatedAt: initialData.updatedAt,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      onSubmit(response.data);
      onClose();
    } catch (err) {
      if (err.response?.status === 409) {
        setConflict(err.response.data); // store conflict for UI
      } else {
        alert(err.response?.data?.message || 'Update failed');
      }
    }
  };

  const handleMerge = () => {
    const merged = {
      ...conflict.serverVersion,
      ...form,
    };

    axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${initialData._id}`, {
      ...merged,
      clientUpdatedAt: conflict.serverVersion.updatedAt,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      onSubmit(form);
      onClose();
    });
  };

  const handleOverwrite = () => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${initialData._id}`, {
      ...form,
      clientUpdatedAt: conflict.serverVersion.updatedAt,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      onSubmit(form);
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData._id ? 'Edit Task' : 'Create Task'}</h2>

        {conflict ? (
          <>
            <p className="conflict-warning">⚠️ This task was modified by someone else.</p>
            <div className="conflict-section">
              <div>
                <h4>Your Changes</h4>
                <pre>{JSON.stringify(form, null, 2)}</pre>
              </div>
              <div>
                <h4>Latest Version</h4>
                <pre>{JSON.stringify(conflict.serverVersion, null, 2)}</pre>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleMerge}>Merge</button>
              <button onClick={handleOverwrite}>Overwrite</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description:
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </label>

            <label>
              Priority:
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label>
              Status:
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </label>

            <div className="modal-actions">
              <button type="submit">{initialData._id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
