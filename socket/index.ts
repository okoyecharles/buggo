import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io';


const PORT = +process.env.PORT!;

const io = new Server(PORT, {
  cors: {
    origin: '*',
  },
});

type User = {
  userId: string;
  socketId: string;
}

interface TicketUser extends User {
  ticketId: string;
}
interface ProjectUser extends User {
  projectId: string;
}

let ticketRoom: TicketUser[] = [];
let projectRoom: ProjectUser[] = [];

const addToRoom = (room: any[], user: any) => {
  const userExists = room.find((u: any) => u.userId === user.userId && u.socketId === user.socketId);

  if (!userExists) {
    room.push(user);
  } else {
    room.splice(room.indexOf(userExists), 1, user);
  }
}

io.on('connection', (socket) => {
  // PROJECT ROOM
  socket?.on('join-project-room', (user: ProjectUser) => {
    user.socketId = socket.id;
    addToRoom(projectRoom, user);
  });

  socket?.on('create-project-ticket', ({ projectId, ticket }) => {
    const users = projectRoom.filter((u) => u.projectId === projectId);

    users.forEach((u) => {
      socket.to(u.socketId).emit('get-project-ticket', ticket);
    });
  });

  socket?.on('delete-project-ticket', ({ projectId, ticketId }) => {
    const users = projectRoom.filter((u) => u.projectId === projectId);

    users.forEach((u) => {
      socket.to(u.socketId).emit('get-project-ticket-delete', ticketId);
    });
  });

  // TICKET ROOM
  socket?.on('join-ticket-room', (user: TicketUser) => {
    user.socketId = socket.id;
    addToRoom(ticketRoom, user);
  });

  socket?.on('send-ticket-comment', ({ ticketId, comment }) => {
    const users = ticketRoom.filter((u) => u.ticketId === ticketId);

    users.forEach((u) => {
      socket.to(u.socketId).emit('get-ticket-comment', comment);
    });
  });

  socket?.on('disconnect', () => {
    ticketRoom = ticketRoom.filter((u) => u.socketId !== socket.id);
    projectRoom = projectRoom.filter((u) => u.socketId !== socket.id);
  });
});

console.log('Socket Server running on port', PORT);