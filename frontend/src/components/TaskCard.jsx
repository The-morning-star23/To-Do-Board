import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../dnd/ItemTypes';

const TaskCard = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task._id, status: task.status },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg shadow-md cursor-grab border bg-white transition-all duration-300 ease-in-out transform ${
        isDragging
          ? 'opacity-40 scale-95 rotate-[-1deg]'
          : 'hover:scale-[1.02] hover:shadow-lg'
      }`}
    >
      <h4 className="font-semibold text-gray-800 break-words">{task.title}</h4>
      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
      <div className="mt-2 text-xs text-indigo-600 font-medium">
        Priority: {task.priority}
      </div>
    </div>
  );
};

export default TaskCard;
