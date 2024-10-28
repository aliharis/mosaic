import React, { useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Block as BlockType } from "../../types";

interface BlockProps {
  block: BlockType;
  isActive: boolean;
  onChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
}

export default function Block({
  block,
  isActive,
  onChange,
  onKeyDown,
  onFocus,
}: BlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const inputRef = useRef<HTMLDivElement>(null);
  // Add a ref to store the cursor position
  const cursorPositionRef = useRef<number>(0);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      restoreSelection();
    }
  }, [isActive, block.content]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBlockStyle = () => {
    switch (block.type) {
      case "heading1":
        return "text-3xl font-bold";
      case "heading2":
        return "text-2xl font-bold";
      case "heading3":
        return "text-xl font-bold";
      case "bulletList":
        return "pl-6 list-disc";
      case "numberedList":
        return "pl-6 list-decimal";
      case "quote":
        return "pl-4 border-l-4 border-gray-200 italic";
      case "code":
        return "font-mono bg-gray-50 p-2 rounded";
      default:
        return "";
    }
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (inputRef.current?.contains(range.startContainer)) {
        cursorPositionRef.current = range.startOffset;
      }
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    const node = inputRef.current?.firstChild || inputRef.current;
    if (selection && node) {
      const range = document.createRange();
      range.setStart(
        node,
        Math.min(cursorPositionRef.current, node.textContent?.length || 0)
      );
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    saveSelection();
    // Get the raw content and normalize spaces
    const content = e.currentTarget.innerText || "";
    onChange(content);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-2 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <div
        ref={inputRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className={`flex-1 outline-none whitespace-pre-wrap ${getBlockStyle()}`}
        dangerouslySetInnerHTML={{ __html: block.content || "<br>" }}
      />
    </div>
  );
}
