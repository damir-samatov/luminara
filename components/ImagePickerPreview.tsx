import { FC, useMemo } from "react";
import { readableFileSize } from "@/utils/string.utils";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";

type ImagePickerPreviewProps = {
  file: File;
  onClickRemove: () => void;
};

export const ImagePickerPreview: FC<ImagePickerPreviewProps> = ({
  file,
  onClickRemove,
}) => {
  const src = useMemo(() => URL.createObjectURL(file), [file]);
  const size = useMemo(() => readableFileSize(file.size), [file.size]);

  return (
    <div key={file.name} className="flex items-start gap-2">
      <div className="aspect-video w-32 flex-shrink-0">
        <Image
          src={src}
          className="rounded-md"
          alt={file.name}
          width={640}
          height={360}
        />
      </div>
      <div className="flex flex-col gap-2 truncate text-gray-400">
        <p className="text-xs">{file.name}</p>
        <p className="text-xs">{size}</p>
      </div>
      <button className="ml-auto" onClick={onClickRemove}>
        <TrashIcon className="h-6 w-6 text-gray-400 hover:text-gray-300" />
      </button>
    </div>
  );
};
