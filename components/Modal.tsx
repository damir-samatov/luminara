import { FC, MouseEventHandler, ReactNode, useCallback } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
};

export const Modal: FC<ModalProps> = ({
  onClose,
  children,
  maxWidth = 600,
}) => {
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
      <div
        style={{
          maxWidth: `${maxWidth}px`,
        }}
        className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 p-6"
      >
        {children}
      </div>
    </div>
  );
};
