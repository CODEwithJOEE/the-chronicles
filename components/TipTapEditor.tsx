// components/TipTapEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
// ✅ Correct imports for TipTap table extensions
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
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
  Table as TableIcon, // ← Renamed to avoid conflict with Table extension
} from "lucide-react";
import { useEffect, useRef } from "react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

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
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "table-auto w-full border-collapse my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-gray-200",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "px-4 py-2 border border-gray-200",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "px-4 py-2 border border-gray-200 bg-gray-50 font-bold text-left",
        },
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

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const deleteSelectedImage = () => {
    const { state } = editor;
    const { selection } = state;

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

        {/* Blockquote, Link, Image, Table */}
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
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Image"
        >
          <ImageIcon size={18} />
        </button>

        {/* Table Button with Dropdown */}
        <div className="relative group">
          <button
            onClick={insertTable}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Insert Table"
          >
            <TableIcon size={18} />
          </button>
          {editor.isActive("table") && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-1 border border-gray-200 min-w-[120px] hidden group-hover:block">
              <button
                onClick={addColumnBefore}
                className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
              >
                Add Column Before
              </button>
              <button
                onClick={addColumnAfter}
                className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
              >
                Add Column After
              </button>
              <button
                onClick={deleteColumn}
                className="w-full text-left px-3 py-1 text-sm hover:bg-red-100 rounded text-red-600"
              >
                Delete Column
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={addRowBefore}
                className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
              >
                Add Row Before
              </button>
              <button
                onClick={addRowAfter}
                className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
              >
                Add Row After
              </button>
              <button
                onClick={deleteRow}
                className="w-full text-left px-3 py-1 text-sm hover:bg-red-100 rounded text-red-600"
              >
                Delete Row
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={deleteTable}
                className="w-full text-left px-3 py-1 text-sm hover:bg-red-100 rounded text-red-600"
              >
                Delete Table
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Delete Image button */}
        <button
          onClick={deleteSelectedImage}
          className="p-2 rounded hover:bg-red-100 transition-colors text-red-600"
          title="Delete Selected Image"
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
