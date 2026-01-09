import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

type CommentWithUser = {
  id: number;
  content: string;
  createdAt: number;
  userId: number;
  userName: string;
};

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Създаваме HTTP сървър
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Прикачаме Socket.IO към HTTP сървъра
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // В production смени с твоя domain
    },
  });

  // Socket.IO логика
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Когато потребител влезе в task страница
    socket.on("join-task", (taskId: string) => {
      socket.join(`task-${taskId}`);
      console.log(`User ${socket.id} joined room: task-${taskId}`);
    });

    // Когато потребител напусне task страница
    socket.on("leave-task", (taskId: string) => {
      socket.leave(`task-${taskId}`);
      console.log(`User ${socket.id} left room: task-${taskId}`);
    });

    // Когато някой изпрати нов коментар
    socket.on(
      "send-comment",
      (data: { taskId: string; comment: CommentWithUser }) => {
        // Изпращаме до всички В СТАЯТА (включително изпращача)
        io.to(`task-${data.taskId}`).emit("new-comment", data.comment);
      }
    );
    // Когато някой редактира коментар
    socket.on(
      "edit-comment",
      (data: { taskId: string; comment: CommentWithUser }) => {
        io.to(`task-${data.taskId}`).emit("comment-edited", data.comment);
      }
    );

    // Когато някой изтрие коментар
    socket.on(
      "delete-comment",
      (data: { taskId: string; commentId: number }) => {
        io.to(`task-${data.taskId}`).emit("comment-deleted", data.commentId);
      }
    );

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
