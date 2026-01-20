import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { CommentWithUser } from "@/hooks/comments";

export const PORT = 3001;

const httpServer = createServer();

const serverIo = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

serverIo.on("connection", (socket) => {
  socket.on("join-task", (taskId: string) => {
    socket.join(`task-${taskId}`);
    console.log(`join task ${taskId}`);
  });

  socket.on("leave-task", (taskId: string) => {
    socket.leave(`task-${taskId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected: from room  ${socket.rooms}`);
  });

  socket.on(
    "send-comment",
    (data: { taskId: string; comment: CommentWithUser }) => {
      serverIo.to(`task-${data.taskId}`).emit("new-comment", data.comment);
    }
  );

  socket.on(
    "edit-comment",
    (data: { taskId: string; comment: CommentWithUser }) => {
      serverIo.to(`task-${data.taskId}`).emit("edited-comment", data.comment);
    }
  );

  socket.on("delete-comment", (data: { taskId: string; commentId: number }) => {
    serverIo.to(`task-${data.taskId}`).emit("comment-deleted", data.commentId);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
