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
    <div className="rounded-md border-2 border-gray-500 bg-gray-950">
      <div className="flex gap-2 border-0 border-b-2 border-gray-600 p-2 text-xl">
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={classNames(
            "w-16 rounded-md border-2 border-gray-500 px-2 text-gray-500 underline",
            editor.isActive("underline") && "bg-gray-500 text-gray-900"
          )}
        >
          U
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={classNames(
            "w-16 rounded-md border-2 border-gray-500 px-2 font-bold text-gray-500",
            editor.isActive("bold") && "bg-gray-500 text-gray-900"
          )}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={classNames(
            "w-16 rounded-md border-2 border-gray-500 px-2 italic text-gray-500",
            editor.isActive("italic") && "bg-gray-500 text-gray-900"
          )}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={classNames(
            "w-16 rounded-md border-2 border-gray-500 px-2 text-gray-500 line-through",
            editor.isActive("strike") && "bg-gray-500 text-gray-900"
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
