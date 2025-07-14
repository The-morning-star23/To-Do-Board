const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { connectMongo } = require('./config/db'); // ✅ Import DB connector

const server = http.createServer(app);

// ✅ Connect to MongoDB before starting the server
connectMongo();

const io = new Server(server, {
  cors: {
    origin: '*', // You can restrict this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach to app so controllers can access
app.set('io', io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
