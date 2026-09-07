// components/TipTapEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useRef } from "react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Custom extension to handle image deletion with Backspace
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },
});

export function TipTapEditor({
  value,
  onChange,
  placeholder = "Write your article...",
}: TipTapEditorProps) {
  const isUpdatingFromParent = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (!isUpdatingFromParent.current) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
      handleKeyDown: (view, event) => {
        // Handle Backspace to delete images
        if (event.key === "Backspace") {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          // Check if we're at the start of a node
          if ($from.parent.type.name === "image") {
            // Delete the image node
            const tr = state.tr.delete($from.before(), $from.after());
            view.dispatch(tr);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      if (value !== currentContent) {
        isUpdatingFromParent.current = true;
        editor.commands.setContent(value);
        isUpdatingFromParent.current = false;
      }
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-8 text-center text-gray-500">
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const removeImage = () => {
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;

    // Check if we're on an image node
    if ($from.parent.type.name === "image") {
      const tr = state.tr.delete($from.before(), $from.after());
      editor.view.dispatch(tr);
      editor.commands.focus();
    } else {
      // Try to find image in selection
      const imageNode = editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "image") {
          const tr = editor.state.tr.delete(pos, pos + node.nodeSize);
          editor.view.dispatch(tr);
          return false;
        }
        return true;
      });
    }
  };

  const deleteSelectedImage = () => {
    const { state } = editor;
    const { selection } = state;

    // Find if selection contains an image
    let foundImage = false;
    const tr = state.tr;

    state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
      if (node.type.name === "image") {
        tr.delete(pos, pos + node.nodeSize);
        foundImage = true;
        return false;
      }
      return true;
    });

    if (foundImage) {
      editor.view.dispatch(tr);
      editor.commands.focus();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Headings */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("strike") ? "bg-gray-200" : ""
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Blockquote, Link, and Image */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("blockquote") ? "bg-gray-200" : ""
          }`}
          title="Blockquote"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
          title="Insert Link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={addImage}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("image") ? "bg-gray-200" : ""
          }`}
          title="Insert Image"
        >
          <ImageIcon size={18} />
        </button>
        <button
          onClick={deleteSelectedImage}
          className="p-2 rounded hover:bg-red-100 transition-colors text-red-600"
          title="Delete Image"
        >
          <Trash2 size={18} />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
