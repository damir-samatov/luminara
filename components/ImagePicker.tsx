import { FC } from "react";
import { FileDrop } from "@/components/FileDrop";
import { ELIGIBLE_IMAGE_TYPES } from "@/configs/file.config";
import { ImagePickerPreview } from "@/components/ImagePickerPreview";
import { classNames } from "@/utils/style.utils";

type ImagePickerProps = {
  label?: string;
  files: File[];
  onChange: (files: File[]) => void;
  vertical?: boolean;
};

export const ImagePicker: FC<ImagePickerProps> = ({
  files,
  onChange,
  label = "Drop the images here",
  vertical = false,
}) => {
  const hasFiles = files.length > 0;
  return (
    <div
      className={classNames(
        "grid h-full items-stretch gap-4",
        !vertical && hasFiles ? "grid-cols-2" : "grid-cols-1"
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
          label={label}
          onChange={onChange}
          eligibleFileTypes={ELIGIBLE_IMAGE_TYPES}
        />
      </div>
    </div>
  );
};
