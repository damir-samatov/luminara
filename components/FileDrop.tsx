import { ChangeEvent, FC, DragEvent, useCallback, useRef } from "react";
import { MAX_FILE_SIZE } from "@/configs/file.config";
import { readableFileSize } from "@/utils/string.utils";
import { toast } from "react-toastify";

type FileDropProps = {
  onChange: (files: File[]) => void;
  eligibleFileTypes: string[];
  maxFileSize?: number;
  label?: string;
};

export const FileDrop: FC<FileDropProps> = ({
  onChange,
  eligibleFileTypes,
  label = "Drop files here",
  maxFileSize = MAX_FILE_SIZE,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFilesChanged = useCallback(
    (newFiles: File[]) => {
      const filteredFiles = newFiles.filter((file) => {
        if (!eligibleFileTypes.includes(file.type)) {
          toast(`${file.name} - file type not supported`, { type: "error" });
          return false;
        }

        if (file.size > maxFileSize) {
          toast(`${file.name} - file size too large`, { type: "error" });
          return false;
        }

        return true;
      });
      onChange(filteredFiles);
      fileInputRef.current!.value = "";
    },
    [maxFileSize, onChange, eligibleFileTypes]
  );

  const onFilesSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      onFilesChanged(selectedFiles);
    },
    [onFilesChanged]
  );

  const onFilesDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files || []);
      onFilesChanged(droppedFiles);
    },
    [onFilesChanged]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div
      className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 p-6 font-bold text-gray-400"
      onClick={onClick}
      onDrop={onFilesDrop}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
    >
      <p className="text-sm">{label}</p>
      <p className="text-xs">Max size - {readableFileSize(maxFileSize)}</p>
      <p className="text-xs">
        {eligibleFileTypes
          .join(", ")
          .replaceAll("image/", ".")
          .replaceAll("video/", ".")}
      </p>
      <input
        hidden
        multiple
        onChange={onFilesSelected}
        ref={fileInputRef}
        type="file"
        accept={eligibleFileTypes.join(",")}
      />
    </div>
  );
};
