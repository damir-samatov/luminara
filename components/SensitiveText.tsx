import { FC, useCallback, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import {
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

type SensitiveTextProps = {
  value: string;
  label: string;
};

export const SensitiveText: FC<SensitiveTextProps> = ({ label, value }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isShown, setIsShown] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = useCallback(async () => {
    const hasCopied = await copyToClipboard(value);
    if (!hasCopied) return;
    toast(`${label} - copied`, { type: "success" });
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }, [value, copyToClipboard, label]);

  return (
    <div className="flex w-full flex-col gap-3 rounded-md bg-gray-900 p-4 text-sm text-gray-100">
      <p className="font-semibold">{label}</p>
      <div className="flex gap-4">
        <input
          type={isShown ? "text" : "password"}
          readOnly
          onClick={onCopy}
          autoComplete="off"
          className="block h-10 w-full cursor-pointer rounded-md bg-gray-700 px-4 text-gray-100 placeholder-gray-400 outline-0"
          value={value}
        />
        <button
          className="block"
          title="Show"
          onClick={() => setIsShown((prev) => !prev)}
        >
          {isShown ? (
            <EyeIcon className="h-6 w-6" />
          ) : (
            <EyeSlashIcon className="h-6 w-6" />
          )}
        </button>
        <button onClick={onCopy} title="Copy">
          {isCopied ? (
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
          ) : (
            <ClipboardIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
};
