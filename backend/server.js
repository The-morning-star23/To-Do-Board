const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { connectMongo } = require('./config/db'); // ✅ Correct path assumed

const startServer = async () => {
  try {
    await connectMongo(); // ✅ Ensure MongoDB connects before starting server

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: '*', // Restrict in production
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer(); // 🚀 Run the async startup
