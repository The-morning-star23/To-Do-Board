import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../dnd/ItemTypes';
import TaskCard from './TaskCard';
import '../styles/column.css';

const Column = ({ title, tasks, onDropTask }) => {
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
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
