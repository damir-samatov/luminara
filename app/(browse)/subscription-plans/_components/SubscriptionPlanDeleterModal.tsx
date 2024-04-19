import { FC, useCallback, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { onDeleteSubscriptionPlanById } from "@/actions/subscription-plan.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

type SubscriptionPlanDeleterModalProps = {
  subscriptionPlanId: string;
};

export const SubscriptionPlanDeleterModal: FC<
  SubscriptionPlanDeleterModalProps
> = ({ subscriptionPlanId }) => {
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
      const res = await onDeleteSubscriptionPlanById(subscriptionPlanId);
      if (!res.success) return toast(res.message, { type: "error" });
      toast(res.message, { type: "success" });
      router.push("/subscription-plans");
      setIsModalOpen(false);
    } catch (error) {
      toast("Something went wrong.", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionPlanId, setIsLoading, setIsModalOpen, router]);

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
