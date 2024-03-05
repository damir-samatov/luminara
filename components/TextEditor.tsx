import { FC, useCallback, useState } from "react";
import { debounce } from "ts-debounce";
import { classNames } from "@/utils/style.utils";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";

type TextEditorProps = {
  onChange: (value: string) => void;
  initialValue: string;
  placeholder?: string;
};

const BUTTON_CLASSNAMES =
  "w-16 rounded-md border-2 border-gray-700 px-2 text-gray-300";

const BUTTON_ACTIVE_CLASSNAMES = "bg-gray-700";

export const TextEditor: FC<TextEditorProps> = ({
  initialValue,
  onChange,
  placeholder = "",
}) => {
  const [text, setText] = useState(initialValue);
  const onInput = useCallback(debounce(onChange, 50), []);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link, TextStyle],
    content: text,
    onUpdate: ({ editor }) => {
      const text = editor.getHTML();
      setText(text);
      onInput(text);
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border-2 border-gray-700 bg-gray-950">
      <div className="flex gap-2 border-0 border-b-2 border-gray-700 p-2 text-xl">
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={classNames(
            " underline",
            BUTTON_CLASSNAMES,
            editor.isActive("underline") && BUTTON_ACTIVE_CLASSNAMES
          )}
        >
          U
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={classNames(
            "font-bold",
            BUTTON_CLASSNAMES,
            editor.isActive("bold") && BUTTON_ACTIVE_CLASSNAMES
          )}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={classNames(
            "italic",
            BUTTON_CLASSNAMES,
            editor.isActive("italic") && BUTTON_ACTIVE_CLASSNAMES
          )}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={classNames(
            "line-through",
            BUTTON_CLASSNAMES,
            editor.isActive("strike") && BUTTON_ACTIVE_CLASSNAMES
          )}
        >
          S
        </button>
      </div>
      <div>
        <EditorContent
          maxLength={1024}
          className="text-editor text-gray-300"
          editor={editor}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
