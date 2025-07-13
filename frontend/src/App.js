import React, { useEffect } from 'react';
import socket from './socket';

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket:', socket.id);
    });

    // Task events
    socket.on('taskCreated', (task) => {
      console.log('Task created:', task);
      // TODO: Add to state
    });

    socket.on('taskUpdated', (task) => {
      console.log('Task updated:', task);
      // TODO: Update in state
    });

    socket.on('taskDeleted', ({ taskId }) => {
      console.log('Task deleted:', taskId);
      // TODO: Remove from state
    });

    // Activity log
    socket.on('actionLogged', (log) => {
      console.log('Action logged:', log);
      // TODO: Add to log panel
    });

    return () => {
      socket.off(); // Cleanup
    };
  }, []);

  return (
    <div>
      {/* Your Routes / Kanban Board / etc. */}
    </div>
  );
}

export default App;
