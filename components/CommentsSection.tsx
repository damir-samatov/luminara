"use client";
import { CommentDto } from "@/types/comment.types";
import { FC, useCallback, useState } from "react";
import { Button } from "@/components/Button";
import { toast } from "react-toastify";
import { onComment } from "@/actions/post-viewer.actions";
import { Modal } from "@/components/Modal";
import { TextInput } from "@/components/TextInput";
import { CommentListItem } from "@/components/CommentListItem";

type CommentsListProps = {
  comments: CommentDto[];
  postId: string;
};

export const CommentsSection: FC<CommentsListProps> = ({
  comments: savedComments,
  postId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState(savedComments);

  const onSubmit = useCallback(async () => {
    try {
      const trimmedComment = commentText.trim();
      if (trimmedComment.length < 1)
        return toast("Comment cannot be empty", { type: "error" });
      if (isLoading) return;
      setIsLoading(true);
      const res = await onComment({
        postId,
        body: trimmedComment,
      });
      if (!res.success) return toast("Failed to comment", { type: "error" });
      setComments((prev) => [res.data.comment, ...prev]);
      toast("Comment submitted", { type: "success" });
      setCommentText("");
      setIsModalOpen(false);
    } catch (error) {
      toast("Something went wrong", { type: "error" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, postId, setIsLoading, setComments, commentText]);

  const onCommentDeleted = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  return (
    <>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-800 bg-gray-950 p-6">
            <p className="text-3xl">Comment</p>
            <TextInput
              maxLength={500}
              isMultiline
              isDisabled={isLoading}
              placeholder="Type your comment..."
              value={commentText}
              onChange={setCommentText}
            />
            <div className="mt-4 flex gap-2">
              <Button
                isDisabled={isLoading}
                type="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                className="flex items-center justify-center gap-2"
                type="primary"
                loadingText="Submitting..."
                onClick={onSubmit}
              >
                <span>Comment</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 items-center gap-4">
          <p className="text-lg font-bold">{comments.length} Comments</p>
          <Button
            type="secondary"
            className="ml-auto max-w-max"
            isDisabled={isLoading}
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-xs">Leave a Comment</span>
          </Button>
        </div>
        <hr className="my-2 border-gray-600" />
        {comments.map((comment) => (
          <CommentListItem
            key={comment.id}
            comment={comment}
            onDeleted={() => onCommentDeleted(comment.id)}
          />
        ))}
      </div>
    </>
  );
};
