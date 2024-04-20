import { FC, useCallback, useMemo, useState } from "react";
import { readableFileSize } from "@/utils/string.utils";
import { Modal } from "@/components/Modal";

type FilePreviewProps = {
  file: File;
};

enum FileType {
  IMAGE = "image",
  VIDEO = "video",
}

export const FilePreview: FC<FilePreviewProps> = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const src = useMemo(() => URL.createObjectURL(file), [file]);
  const size = useMemo(() => readableFileSize(file.size), [file.size]);

  const fileType = useMemo(() => {
    if (file.type.includes("video")) return FileType.VIDEO;
    return FileType.IMAGE;
  }, [file.type]);

  const onImageClick = useCallback(() => {
    if (fileType === FileType.IMAGE) setIsModalOpen((prev) => !prev);
  }, [fileType]);

  const filePreview = useMemo(() => {
    if (fileType === FileType.VIDEO)
      return (
        <video
          src={src}
          controls
          width={1920}
          height={1080}
          className="aspect-video object-contain"
        />
      );

    return (
      <img
        src={src}
        alt={file.name}
        width={1920}
        height={1080}
        className="aspect-video cursor-pointer  object-contain"
        onClick={onImageClick}
      />
    );
  }, [fileType, src, file.name, onImageClick]);

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        {filePreview}
      </div>
      <div className="text-xs text-gray-400">
        <p className="truncate">{file.name}</p>
        <p className="truncate">
          {file.type} - {size}
        </p>
      </div>
      {fileType === FileType.IMAGE && isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} maxWidth={1200}>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            {filePreview}
          </div>
        </Modal>
      )}
    </div>
  );
};
