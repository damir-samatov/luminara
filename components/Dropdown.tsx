import { FC, useCallback, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { classNames } from "@/utils/style.utils";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  active: Option;
  onChange: (option: Option) => void;
  options: Option[];
};

export const Dropdown: FC<DropdownProps> = ({ options, active, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
  }, []);
  useOnClickOutside(containerRef, handleClickOutside);

  const onOptionClick = useCallback(
    (option: Option) => {
      setIsOpen((prev) => !prev);
      onChange(option);
    },
    [onChange]
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setIsOpen((p) => !p)}
        className={classNames(
          "block w-full rounded border-2 border-gray-700 bg-transparent px-8 py-2 text-center text-xs font-semibold text-gray-100 hover:border-gray-600 hover:bg-gray-600"
        )}
      >
        <span>{active.label}</span>
      </button>
      <div className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2">
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-100" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-100" />
        )}
      </div>
      {isOpen && (
        <div className="absolute left-0 right-0 top-[120%] z-10 flex flex-col rounded-lg bg-gray-900">
          {options.map((option) => {
            if (option.value !== active.value)
              return (
                <button
                  key={option.value}
                  onClick={() => onOptionClick(option)}
                  className={classNames(
                    "block w-full rounded bg-gray-900 px-4 py-2 text-center text-xs font-semibold text-gray-100 hover:bg-gray-700"
                  )}
                >
                  {option.label}
                </button>
              );
          })}
        </div>
      )}
    </div>
  );
};
