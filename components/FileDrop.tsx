import { ChangeEvent, FC, DragEvent, useCallback, useRef } from "react";
import { MAX_FILE_SIZE } from "@/configs/file.config";

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

  const onFilesSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      const filteredFiles = selectedFiles.filter(
        (file) => file.size < MAX_FILE_SIZE
      );
      onChange(filteredFiles);
      fileInputRef.current!.value = "";
    },
    [onChange]
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const selectedFiles = Array.from(event.dataTransfer.files || []);
      const filteredFiles = selectedFiles.filter(
        (file) => file.size < maxFileSize
      );
      onChange(filteredFiles);
    },
    [onChange, maxFileSize]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div
      className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-500 p-6 font-bold text-gray-500"
      onClick={onClick}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
    >
      <p>{label}</p>
      <p className="text-xs">
        {"Accepts: " +
          eligibleFileTypes
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
