import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { CommentWithUser } from "./comments";

export function useSocket(taskId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001");
    }

    socketRef.current?.on("connect", () => setIsConnected(true));
    socketRef.current?.on("disconnect", () => setIsConnected(false));
    socketRef.current.emit("join-task", taskId);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-task", taskId);
      }
    };
  }, [taskId]);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendComment = (comment: CommentWithUser) => {
    socketRef.current?.emit("send-comment", { taskId, comment });
  };

  const editComment = (comment: CommentWithUser) => {
    socketRef.current?.emit("edit-comment", { taskId, comment });
  };

  const deleteComment = (commentId: number) => {
    socketRef.current?.emit("delete-comment", { taskId, commentId });
  };

  const onNewComment = (callback: (comment: CommentWithUser) => void) => {
    socketRef.current?.on("new-comment", callback);

    return () => {
      socketRef.current?.off("new-comment", callback);
    };
  };

  const onEditedComment = (callback: (comment: CommentWithUser) => void) => {
    socketRef.current?.on("edited-comment", callback);

    return () => {
      socketRef.current?.off("edited-comment", callback);
    };
  };

  const onDeletedComment = (callback: (commentId: number) => void) => {
    socketRef.current?.on("comment-deleted", callback);

    return () => {
      socketRef.current?.off("comment-deleted", callback);
    };
  };

  return {
    isConnected,
    sendComment,
    editComment,
    deleteComment,
    onNewComment,
    onEditedComment,
    onDeletedComment,
  };
}
