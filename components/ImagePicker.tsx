import { FC } from "react";
import { FileDrop } from "@/components/FileDrop";
import { ELIGIBLE_IMAGE_TYPES } from "@/configs/file.config";
import { ImagePickerPreview } from "@/components/ImagePickerPreview";

type ImagePickerProps = {
  files: File[];
  onChange: (files: File[]) => void;
};

export const ImagePicker: FC<ImagePickerProps> = ({ files, onChange }) => {
  return (
    <div className="grid grid-cols-2 items-stretch gap-4 py-4">
      <div className="flex flex-col gap-4">
        {files.length < 1 && (
          <p className="text-center text-sm">No images selected</p>
        )}
        {files.map((file) => (
          <ImagePickerPreview
            key={file.name}
            file={file}
            onClickRemove={() =>
              onChange(files.filter((f) => f.name !== file.name))
            }
          />
        ))}
      </div>
      <div>
        <FileDrop
          label="Drop images here"
          onChange={onChange}
          eligibleFileTypes={ELIGIBLE_IMAGE_TYPES}
        />
      </div>
    </div>
  );
};
