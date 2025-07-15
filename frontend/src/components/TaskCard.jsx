import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../dnd/ItemTypes';
import '../styles/taskCard.css';
import axios from 'axios';

const TaskCard = ({ task, onSmartAssign }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleSmartAssign = async () => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${task._id}/smart-assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      onSmartAssign(task._id, res.data.task); // callback to update state
    } catch (err) {
      alert(err.response?.data?.message || 'Smart assign failed');
    }
  };

  return (
    <div ref={drag} className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <h4 className="task-title">{task.title}</h4>
      <p className="task-desc">{task.description}</p>
      <div className="task-priority">Priority: {task.priority}</div>
      {task.assignedTo && (
        <div className="task-assigned">Assigned to: {task.assignedTo.username}</div>
      )}

      <div className="task-actions">
        <button className="assign-btn" onClick={handleSmartAssign}>
          Smart Assign
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
