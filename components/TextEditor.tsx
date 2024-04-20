import { FC, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/Button";
import { classNames } from "@/utils/style.utils";

type TextEditorProps = {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  forceUpdate?: unknown;
  isDisabled?: boolean;
};

export const TextEditor: FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "",
  forceUpdate,
  isDisabled = false,
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
  }, [forceUpdate]);

  useEffect(() => {
    if (editor) editor.setEditable(!isDisabled);
  }, [editor, isDisabled]);

  if (!editor)
    return (
      <div className="flex h-[190px] flex-col rounded border-2 border-gray-700 bg-gray-950">
        <Loader />
      </div>
    );

  return (
    <div
      className={classNames(
        "rounded border-2 border-gray-700 bg-gray-950",
        isDisabled && "cursor-not-allowed"
      )}
    >
      <div className="flex gap-2 border-0 border-b-2 border-gray-700 p-2 text-xl">
        <Button
          type={editor.isActive("underline") ? "primary" : "secondary"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isDisabled={
            isDisabled || !editor.can().chain().focus().toggleUnderline().run()
          }
          className="max-w-16 underline"
        >
          U
        </Button>
        <Button
          type={editor.isActive("bold") ? "primary" : "secondary"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isDisabled={
            isDisabled || !editor.can().chain().focus().toggleBold().run()
          }
          className="max-w-16 font-bold"
        >
          B
        </Button>
        <Button
          type={editor.isActive("italic") ? "primary" : "secondary"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isDisabled={
            isDisabled || !editor.can().chain().focus().toggleItalic().run()
          }
          className="max-w-16 italic"
        >
          I
        </Button>
        <Button
          type={editor.isActive("strike") ? "primary" : "secondary"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isDisabled={
            isDisabled || !editor.can().chain().focus().toggleStrike().run()
          }
          className="max-w-16 line-through"
        >
          S
        </Button>
      </div>
      <div className="text-editor text-gray-300">
        {isDisabled ? (
          <div
            className="tiptap cursor-not-allowed"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <EditorContent
            maxLength={1024}
            editor={editor}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};
