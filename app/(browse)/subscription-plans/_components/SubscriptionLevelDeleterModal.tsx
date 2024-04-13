import { FC, useCallback, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { onDeleteSubscriptionLevelById } from "@/actions/subscription-level.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type SubscriptionLevelDeleterModalProps = {
  subscriptionLevelId: string;
};

export const SubscriptionLevelDeleterModal: FC<
  SubscriptionLevelDeleterModalProps
> = ({ subscriptionLevelId }) => {
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
      const res = await onDeleteSubscriptionLevelById(subscriptionLevelId);
      if (!res.success) return toast(res.message, { type: "error" });
      toast(res.message, { type: "success" });
      router.push("/subscription-plans");
      setIsModalOpen(false);
    } catch (error) {
      toast("Something went wrong.", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionLevelId, setIsLoading, setIsModalOpen, router]);

  return (
    <div>
      <Button
        className="px-6"
        size="max-content"
        type="secondary"
        onClick={onDeleteClick}
      >
        Delete
      </Button>
      {isModalOpen && (
        <Modal onClose={onCancelClick}>
          <div className="flex flex-col gap-2">
            <p className="text-2xl">Confirm deletion!</p>
            <p>Are you sure you want to delete this subscription plan?</p>
            <p>All the subscriptions to this plan will be canceled</p>
            <div className="mt-4 flex gap-4">
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
                loadingText="Deleting..."
                onClick={onDeleteConfirmClick}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
