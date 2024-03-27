import { FC, useMemo } from "react";
import { readableFileSize } from "@/utils/string.utils";
import { XMarkIcon } from "@heroicons/react/24/outline";

type VideoPickerPreviewProps = {
  file: File;
  onClickRemove: () => void;
};

export const VideoPickerPreview: FC<VideoPickerPreviewProps> = ({
  file,
  onClickRemove,
}) => {
  const src = useMemo(() => URL.createObjectURL(file), [file]);
  const size = useMemo(() => readableFileSize(file.size), [file.size]);

  return (
    <div key={file.name} className="flex items-start gap-2">
      <div className="aspect-video w-32 flex-shrink-0">
        <video src={src} className="rounded-md" />
      </div>
      <div className="flex flex-col gap-2 overflow-hidden p-4 text-gray-400">
        <p className="truncate text-xs">{file.name}</p>
        <p className="truncate text-xs">{size}</p>
      </div>
      <button
        className="ml-auto text-gray-400 hover:text-gray-200"
        onClick={onClickRemove}
      >
        <XMarkIcon className="h-8 w-8" />
      </button>
    </div>
  );
};
