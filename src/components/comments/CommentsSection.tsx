"use client";
// имам invalidateQueries но също така позлвам и queryClient.setQueryData

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllComments, useCreateComment } from "@/hooks/comments";
import { useCurrentUser } from "@/hooks/useAuth";
import { useEditComment, useDeleteComment } from "@/hooks/comments";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/hooks/useSocket";

import { CommentWithUser } from "@/hooks/comments";

type CommentsSectionProps = {
  taskId: string;
  projectId: string;
};

export default function CommentsSection({
  taskId,
  projectId,
}: CommentsSectionProps) {
  const {
    sendComment: emitComment,
    editCommentSocket,
    deleteCommentSocket,
    onNewComment,
    onCommentEdited,
    onCommentDeleted,
    isConnected,
  } = useSocket(taskId);

  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onNewComment((comment: CommentWithUser) => {
      queryClient.setQueryData(
        ["allTaskComments", taskId],
        (oldData: { taskComments: CommentWithUser[] } | undefined) => {
          if (!oldData) return { taskComments: [comment] };

          const exists = oldData.taskComments.some((c) => c.id === comment.id);
          if (exists) return oldData;

          return {
            taskComments: [...oldData.taskComments, comment],
          };
        }
      );
    });

    return unsubscribe;
  }, [onNewComment, queryClient, taskId]);

  useEffect(() => {
    const unsubscribe = onCommentEdited((editedComment: CommentWithUser) => {
      queryClient.setQueryData(
        ["allTaskComments", taskId],
        (oldData: { taskComments: CommentWithUser[] } | undefined) => {
          if (!oldData) return oldData;
          return {
            taskComments: oldData.taskComments.map((c) =>
              c.id === editedComment.id ? editedComment : c
            ),
          };
        }
      );
    });
    return unsubscribe;
  }, [onCommentEdited, queryClient, taskId]);

  useEffect(() => {
    const unsubscribe = onCommentDeleted((commentId: number) => {
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
    });
    return unsubscribe;
  }, [onCommentDeleted, queryClient, taskId]);

  const {
    mutate: editComment,
    isPending: pendingEditing,
    error: errorEditing,
  } = useEditComment(taskId, projectId);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  function handleEditClick(comment: CommentWithUser) {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  }

  function handleSaveEdit() {
    if (editingCommentId === null) return;

    const originalComment = comments.find((c) => c.id === editingCommentId);

    editComment(
      { commentId: String(editingCommentId), content: editContent },
      {
        onSuccess: () => {
          if (currentUser && originalComment) {
            editCommentSocket({
              id: editingCommentId,
              content: editContent,
              createdAt: originalComment.createdAt,
              userId: currentUser.id,
              userName: currentUser.name,
              userRole: currentUser.role,
            });
          }

          setEditingCommentId(null);
          setEditContent("");
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
      { content: newComment },
      {
        onSuccess: (response) => {
          setNewComment("");

          if (response.comment && currentUser) {
            const fullComment: CommentWithUser = {
              id: response.comment.id,
              content: response.comment.content,
              createdAt: response.comment.created_at,
              userId: currentUser.id,
              userName: currentUser.name,
              userRole: currentUser.role,
            };
            emitComment(fullComment);
          }
        },
      }
    );
  }
  const {
    mutate: deleteComment,
    isPending: pendingDeleting,
    isError: errorDeleting,
  } = useDeleteComment(taskId, projectId);

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments</p>;

  const comments = data?.taskComments ?? [];
  const sortedComments = [...comments].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Comments ({comments.length})
          <span
            className={`ml-2 text-xs ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {isConnected ? "● Live" : "○ Offline"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {sortedComments.length === 0 ? (
            <p className="text-muted-foreground">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {sortedComments.map((comment) => {
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
                                      deleteCommentSocket(comment.id);
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
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" disabled={isPending || !newComment.trim()}>
            {isPending ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
