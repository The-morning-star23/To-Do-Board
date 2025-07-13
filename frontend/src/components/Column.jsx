import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../dnd/ItemTypes';
import TaskCard from './TaskCard';

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
    <div ref={drop} className="bg-white/90 backdrop-blur-lg w-80 p-4 min-w-[18rem] rounded-xl shadow-sm border border-gray-200 flex flex-col max-h-[90vh]">
      <h2 className="text-lg font-bold mb-4 sticky top-0 bg-white z-10 pb-2 border-b">{title}</h2>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
