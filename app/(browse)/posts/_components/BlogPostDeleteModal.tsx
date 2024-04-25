"use client";
import { FC, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { onDeleteBlogPostById } from "@/actions/blog-post.actions";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";

type BlogPostDeleterModalProps = {
  id: string;
};

export const BlogPostDeleterModal: FC<BlogPostDeleterModalProps> = ({ id }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const onCancelClick = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onDeleteConfirmClick = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await onDeleteBlogPostById(id);
      if (!res.success) return toast(res.message, { type: "error" });
      toast(res.message, { type: "success" });
      router.push("/posts");
      setIsModalOpen(false);
    } catch (error) {
      toast("Something went wrong.", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [id, setIsLoading, setIsModalOpen, router]);

  return (
    <div>
      <Button
        onClick={onDeleteClick}
        className="flex items-center justify-center gap-2"
        type="danger"
      >
        <TrashIcon className="h-3 w-3" />
        <span>Delete</span>
      </Button>
      {isModalOpen && (
        <Modal onClose={onCancelClick}>
          <div className="flex flex-col gap-4 rounded-lg border-2 border-gray-800 bg-gray-950 p-6">
            <p className="text-3xl">Confirm deletion!</p>
            <div>
              <p>Are you sure you want to delete this blog post?</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                isDisabled={isLoading}
                type="secondary"
                onClick={onCancelClick}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                className="flex items-center justify-center gap-2"
                type="danger"
                loadingText="Deleting..."
                onClick={onDeleteConfirmClick}
              >
                <TrashIcon className="h-3 w-3" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
