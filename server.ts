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
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join-task", (taskId: string) => {
      socket.join(`task-${taskId}`);
    });

    socket.on("leave-task", (taskId: string) => {
      socket.leave(`task-${taskId}`);
    });

    socket.on(
      "send-comment",
      (data: { taskId: string; comment: CommentWithUser }) => {
        io.to(`task-${data.taskId}`).emit("new-comment", data.comment);
      }
    );

    socket.on(
      "edit-comment",
      (data: { taskId: string; comment: CommentWithUser }) => {
        io.to(`task-${data.taskId}`).emit("comment-edited", data.comment);
      }
    );

    socket.on(
      "delete-comment",
      (data: { taskId: string; commentId: number }) => {
        io.to(`task-${data.taskId}`).emit("comment-deleted", data.commentId);
      }
    );

    socket.on("disconnect", () => {});
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
