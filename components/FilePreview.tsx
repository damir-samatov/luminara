import { FC, useMemo, useState } from "react";
import { readableFileSize } from "@/utils/string.utils";
import { Modal } from "@/components/Modal";

type FilePreviewProps = {
  file: File;
};

export const FilePreview: FC<FilePreviewProps> = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const src = useMemo(() => URL.createObjectURL(file), [file]);
  const size = useMemo(() => readableFileSize(file.size), [file.size]);

  const media = useMemo(() => {
    if (file.type.includes("image")) {
      return (
        <img
          src={src}
          className="cursor-pointer rounded-lg object-contain"
          alt={file.name}
          width={1920}
          height={1080}
          onClick={() => setIsModalOpen(true)}
        />
      );
    }
    if (file.type.includes("video")) {
      return (
        <video
          src={src}
          className="cursor-pointer rounded-lg object-contain"
          onClick={() => setIsModalOpen(true)}
        />
      );
    }
    return <p>{file.name}</p>;
  }, [file.type, file.name, src]);

  return (
    <div>
      <div className="aspect-video h-auto w-full flex-grow-0">{media}</div>
      <div className="relative mt-4 flex flex-col gap-2 overflow-hidden text-gray-400">
        <p className="truncate text-xs">Name: {file.name}</p>
        <p className="truncate text-xs">Type: {file.type}</p>
        <p className="truncate text-xs">Size: {size}</p>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>{media}</Modal>
        )}
      </div>
    </div>
  );
};
