import { FC } from "react";
import { FileDrop } from "@/components/FileDrop";
import { ELIGIBLE_IMAGE_TYPES } from "@/configs/file.config";
import { ImagePickerPreview } from "@/components/ImagePickerPreview";
import { classNames } from "@/utils/style.utils";

type ImagePickerProps = {
  files: File[];
  onChange: (files: File[]) => void;
};

export const ImagePicker: FC<ImagePickerProps> = ({ files, onChange }) => {
  const hasFiles = files.length > 0;
  return (
    <div
      className={classNames(
        "grid items-stretch gap-4",
        hasFiles && "grid-cols-2"
      )}
    >
      {hasFiles && (
        <div className="flex flex-col gap-4">
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
      )}
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
