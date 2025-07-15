import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../dnd/ItemTypes';
import TaskCard from './TaskCard';
import '../styles/column.css';

const Column = ({ title, tasks, onDropTask, onSmartAssign, onEditTask, onDeleteTask }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.status !== title) {
        onDropTask(item.id, title);
      }
    },
  });

  return (
    <div ref={drop} className="column">
      <h2 className="column-title">{title}</h2>
      <div className="column-tasks">
        {tasks.length === 0 ? (
          <div className="empty-column-msg">No tasks</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onSmartAssign={onSmartAssign}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;
