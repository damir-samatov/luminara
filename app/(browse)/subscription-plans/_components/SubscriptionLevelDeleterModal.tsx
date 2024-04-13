import { FC, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

type SubscriptionLevelDeleterModalProps = {
  subscriptionLevelId: string;
};

export const SubscriptionLevelDeleterModal: FC<
  SubscriptionLevelDeleterModalProps
> = ({ subscriptionLevelId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDeleteClick = () => {
    setIsModalOpen(true);
  };

  const onCancelClick = () => {
    setIsModalOpen(false);
  };

  const onDeleteConfirmClick = () => {
    //TODO DELETION LOGIC
    console.log(subscriptionLevelId);
    setIsModalOpen(false);
  };

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
              <Button type="secondary" onClick={onCancelClick}>
                Cancel
              </Button>
              <Button onClick={onDeleteConfirmClick}>Confirm</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
