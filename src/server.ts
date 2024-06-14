import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Socket.io event handling
io.on('connection', (socket: Socket) => {
    console.log('A user connected');

    // Example: Joining a room based on userId
    const userId = socket.handshake.query.userId;
    if (userId) {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined room user-${userId}`);
    }

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
