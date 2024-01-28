"use client";
import { ChangeEvent, FC, DragEvent, useCallback, useRef } from "react";

interface FileDropProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export const FileDrop: FC<FileDropProps> = ({ files, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFilesSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      onChange(selectedFiles);
      console.log(selectedFiles);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const selectedFiles = Array.from(event.dataTransfer.files || []);
      onChange(selectedFiles);
      console.log(selectedFiles);
    },
    [onChange]
  );

  return (
    <div>
      <div
        className="h-24 w-full bg-blue-300"
        onClick={onClick}
        onDrop={onDrop}
      >
        <input
          hidden
          multiple
          onChange={onFilesSelected}
          ref={fileInputRef}
          type="file"
        />
      </div>
      {files.map((file) => (
        <div key={file.name}>{file.name}</div>
      ))}
    </div>
  );
};
