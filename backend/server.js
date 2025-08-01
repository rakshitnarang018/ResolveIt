// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Import middleware and routes
const { errorHandler } = require('./utils/errorHandler');
const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// --- Middleware Setup ---

// Configure CORS to allow requests from the frontend client
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsers for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Socket.IO Setup for Real-time Updates ---

const io = new Server(server, {
  cors: corsOptions
});

// Make io accessible to other parts of the app (like controllers)
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Example: joining a room for a specific case
  socket.on('joinCaseRoom', (caseId) => {
    socket.join(caseId);
    console.log(`User ${socket.id} joined room for case ${caseId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// --- API Routes ---

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the ResolveIt API!' });
});

app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/admin', adminRoutes);


// --- Error Handling ---

// Custom error handling middleware (must be last)
app.use(errorHandler);


// --- Start Server ---

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend should be running on: ${process.env.CLIENT_URL}`);
});