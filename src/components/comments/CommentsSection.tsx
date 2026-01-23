"use client";

import { useState, useEffect } from "react";
import { socket } from "../../../socket";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllComments, useCreateComment } from "@/hooks/comments";
import { useCurrentUser } from "@/hooks/useAuth";
import { useEditComment, useDeleteComment } from "@/hooks/comments";

import { CommentWithUser } from "@/hooks/comments";
import ImageUploader from "../additional/ImageUploader";

type CommentsSectionProps = {
  taskId: string;
  projectId: string;
};

export default function CommentsSection({
  taskId,
  projectId,
}: CommentsSectionProps) {
  const [commentImageId, setCommentImageId] = useState<number | undefined>(undefined);
  const { data: currentUser } = useCurrentUser();
  const [isConnected, setIsConnected] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const joinRoom = () => {
      socket.emit("join-task", taskId);
    };

    if (socket.connected) {
      joinRoom();
      onConnect();
    }

    socket.on("connect", joinRoom);

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    const handleNewComment = (comment: CommentWithUser) => {
      queryClient.setQueryData(
        ["allTaskComments", taskId],
        (oldData: { taskComments: CommentWithUser[] } | undefined) => {
          if (!oldData) return { taskComments: [comment] };
          return { taskComments: [...oldData.taskComments, comment] };
        }
      );
    };

    const handleEditedComment = (comment: CommentWithUser) => {
      queryClient.setQueryData(
        ["allTaskComments", taskId],
        (oldData: { taskComments: CommentWithUser[] } | undefined) => {
          if (!oldData) return oldData;
          return {
            taskComments: oldData.taskComments.map((c) =>
              c.id === comment.id ? comment : c
            ),
          };
        }
      );
    };

    const handleDeletedComment = (commentId: number) => {
      queryClient.setQueryData(
        ["allTaskComments", taskId],
        (oldData: { taskComments: CommentWithUser[] } | undefined) => {
          if (!oldData) return oldData;
          return {
            taskComments: oldData.taskComments.filter(
              (c) => c.id !== commentId
            ),
          };
        }
      );
    };

    socket.on("new-comment", handleNewComment);
    socket.on("edited-comment", handleEditedComment);
    socket.on("comment-deleted", handleDeletedComment);

    return () => {
      socket.offAny();
      socket.emit("leave-task", taskId);
      socket.off("connect", joinRoom);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-comment", handleNewComment);
      socket.off("edited-comment", handleEditedComment);
      socket.off("comment-deleted", handleDeletedComment);
    };
  }, [taskId, queryClient]);

  const { mutate: editComment, isPending: pendingEditing } = useEditComment(
    taskId,
    projectId
  );

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImageId, setEditImageId] = useState<number | null>(null);

  function handleEditClick(comment: CommentWithUser) {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setEditImageId(comment.imageId ?? null)
  }

  function handleSaveEdit() {
    if (editingCommentId === null) return;

    editComment(
      { commentId: String(editingCommentId), content: editContent, imageId: editImageId ?? undefined },
      {
        onSuccess: (data) => {
          socket.emit("edit-comment", {
            taskId,
            comment: {
              id: data.comment.id,
              content: data.comment.content,
              createdAt: data.comment.created_at,
              userId: currentUser?.id,
              userName: currentUser?.name,
              userRole: currentUser?.role,
              imageId:editImageId

            },
          });
          setEditingCommentId(null);
          setEditContent("");
          setEditImageId(null)
        },
      }
    );
  }

  function handleCancelEdit() {
    setEditingCommentId(null);
    setEditContent("");
  }

  const [newComment, setNewComment] = useState("");

  const { data, isLoading, error } = useGetAllComments(taskId, projectId);

  const { mutate: createComment, isPending } = useCreateComment(
    taskId,
    projectId
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createComment(
      { content: newComment,imageId:commentImageId },
      {
        onSuccess: (data) => {
          const payload = {
            taskId,
            comment: {
              id: data.comment.id,
              content: data.comment.content,
              createdAt: data.comment.created_at,
              userId: currentUser?.id,
              userName: currentUser?.name,
              userRole: currentUser?.role,
            },
          };

          socket.emit("send-comment", payload);
          setNewComment("");
        },
      }
    );
  }

  const { mutate: deleteComment, isPending: pendingDeleting } =
    useDeleteComment(taskId, projectId);

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments</p>;

  const comments = data?.taskComments ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Comments ({comments.length})
          <span className={isConnected ? "text-green-500" : "text-red-500"}>
            {isConnected ? " 🟢" : " 🔴"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => {
                const isOwnComment = comment.userId === currentUser?.id;

                return (
                  <div
                    key={comment.id}
                    className={`flex ${
                      isOwnComment ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`min-w-[250px] max-w-[70%] shrink-0 rounded-lg p-3 ${
                        isOwnComment
                          ? "bg-secondary text-secondary-foreground "
                          : "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={isOwnComment ? "secondary" : "outline"}>
                          {`${comment.userName} - (${comment.userRole})`}
                        </Badge>
                        <span className="text-xs opacity-70">
                          {new Date(comment.createdAt * 1000).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      {editingCommentId === comment.id ? (
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px] max-h-[250px] w-full overflow-y-auto"
                        />
                      ) : (
                        <p className="text-sm">{comment.content}</p>
                      )}

                      {isOwnComment && (
                        <div className="flex justify-end gap-2 mt-2">
                          {editingCommentId === comment.id ? (
                            <>
                              <Button size="sm" onClick={handleSaveEdit}>
                                {pendingEditing ? "Save..." : "Save"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-red-500"
                                type="button"
                                onClick={() => {
                                  deleteComment(String(comment.id), {
                                    onSuccess: () => {
                                      socket.emit("delete-comment", {
                                        taskId,
                                        commentId: comment.id,
                                      });
                                    },
                                  });
                                }}
                              >
                                {pendingDeleting ? "Deleting" : "Delete"}
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditClick(comment)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <div className="flex gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-6"
          />
          <div className="flex-4">
  <ImageUploader 
    type="comment" 
    onUploadComplete={(imageId) => setCommentImageId(imageId)} 

  />
</div>

          </div>
          
          <Button type="submit" disabled={isPending || (!newComment.trim() && !commentImageId)}>
            {isPending ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
