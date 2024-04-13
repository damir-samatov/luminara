import { FC, MouseEventHandler, ReactNode, useCallback } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};

export const Modal: FC<ModalProps> = ({ onClose, children }) => {
  const onOverlayClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <div
      data-overlay="true"
      className="fixed bottom-0 left-0 right-0 top-0 z-50 bg-black bg-opacity-50"
      onClick={onOverlayClick}
    >
      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="relative rounded-lg border-2 border-gray-800 bg-gray-950 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
