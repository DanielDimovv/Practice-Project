"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CommentWithUser } from "./comments";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io("http://localhost:3000", {
      autoConnect: true,
    });
  }
  return socket;
}

export function useSocket(taskId: string) {
  const socketRef = useRef<Socket | null>(null);

  // Инициализираме с реалното състояние (lazy init)
  const [isConnected, setIsConnected] = useState(() => {
    return socket?.connected ?? false;
  });

  useEffect(() => {
    socketRef.current = getSocket();
    const currentSocket = socketRef.current;

    // Следим connection status
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    currentSocket.on("connect", onConnect);
    currentSocket.on("disconnect", onDisconnect);

    currentSocket.emit("join-task", taskId);
    console.log(`📡 Joined room: task-${taskId}`);

    return () => {
      currentSocket.emit("leave-task", taskId);
      currentSocket.off("connect", onConnect);
      currentSocket.off("disconnect", onDisconnect);
      console.log(`📡 Left room: task-${taskId}`);
    };
  }, [taskId]);

  const sendComment = useCallback(
    (comment: CommentWithUser) => {
      socketRef.current?.emit("send-comment", { taskId, comment });
    },
    [taskId]
  );

  const onNewComment = useCallback(
    (callback: (comment: CommentWithUser) => void) => {
      const currentSocket = socketRef.current;
      if (!currentSocket) return () => {};

      currentSocket.on("new-comment", callback);
      return () => {
        currentSocket.off("new-comment", callback);
      };
    },
    []
  );

  return {
    sendComment,
    onNewComment,
    isConnected,
  };
}
