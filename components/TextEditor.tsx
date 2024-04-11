import { FC, useEffect } from "react";
import { classNames } from "@/utils/style.utils";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";

type TextEditorProps = {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  forceUpdate?: unknown;
};

const BUTTON_CLASSNAMES =
  "w-16 rounded-md border-2 border-gray-700 px-2 text-gray-300";

const BUTTON_ACTIVE_CLASSNAMES = "bg-gray-700";

export const TextEditor: FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "",
  forceUpdate,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link, TextStyle],
    content: value,
    onUpdate: ({ editor }) => {
      const newText = editor.getHTML();
      onChange(newText);
    },
  });

  useEffect(() => {
    if (editor) editor.commands.setContent(value);
    console.log("forceUpdate", forceUpdate);
  }, [forceUpdate]);

  if (!editor) return null;

  return (
    <div className="rounded border-2 border-gray-700 bg-gray-950">
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
