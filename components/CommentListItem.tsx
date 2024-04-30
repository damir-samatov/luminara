import Link from "next/link";
import { stringToColor } from "@/utils/style.utils";
import { CommentDto } from "@/types/comment.types";
import { FC, useState } from "react";
import { onDeleteCommentAsViewer } from "@/actions/post-viewer.actions";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Button } from "@/components/Button";

type CommentListItemProps = {
  comment: CommentDto;
  onDeleted: () => void;
};

export const CommentListItem: FC<CommentListItemProps> = ({
  comment,
  onDeleted,
}) => {
  const { self } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteClick = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const res = await onDeleteCommentAsViewer(comment.id);
      if (!res.success)
        return toast("Failed to delete comment", { type: "error" });
      toast("Comment deleted", { type: "success" });
      onDeleted();
    } catch (error) {
      toast("Something went wrong", { type: "error" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div key={comment.id}>
      <div className="flex items-start gap-4">
        <Link
          className="flex items-end gap-2"
          href={`/users/${comment.user.username}`}
        >
          <img
            className="h-8 w-8 rounded-full"
            src={comment.user.imageUrl}
            alt={comment.user.username}
          />
          <p className="text-sm">
            <span
              style={{
                color: stringToColor(comment.user.username),
              }}
            >
              @
            </span>
            {comment.user.username}
          </p>
        </Link>
        {self.id === comment.user.id && (
          <Button
            type="blank"
            className="ml-auto text-xs text-red-600 hover:text-gray-100"
            onClick={onDeleteClick}
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        )}
      </div>
      <p className="mt-4 whitespace-pre-wrap break-words text-xs">
        {comment.body}
      </p>
      <p className="text-end text-xs text-gray-500">
        {comment.createdAt.toDateString()}
      </p>
    </div>
  );
};
