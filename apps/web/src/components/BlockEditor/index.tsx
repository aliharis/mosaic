import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Block from "./Block";
import BlockMenu from "./BlockMenu";
import type { Block as BlockType } from "../../types";

interface BlockEditorProps {
  blocks: BlockType[];
  onChange: (blocks: BlockType[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [menuState, setMenuState] = useState<{
    show: boolean;
    query: string;
    position: { x: number; y: number };
  }>({
    show: false,
    query: "",
    position: { x: 0, y: 0 },
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuState.show &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuState((prev) => ({ ...prev, show: false }));
      }
    };

    // Handle escape key globally
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (menuState.show && event.key === "Escape") {
        // TODO: Close the menu
        // Keep it disabled for now since the modal also closes on escape
        // setMenuState((prev) => ({ ...prev, show: false }));
      }
    };

    if (menuState.show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [menuState.show]);

  const handleBlockChange = (id: string, content: string) => {
    onChange(
      blocks.map((block) => (block.id === id ? { ...block, content } : block))
    );
  };

  const handleKeyDown = useCallback(
    (id: string, e: React.KeyboardEvent) => {
      console.log("handleKeyDown", id, e.key);
      const block = blocks.find((b) => b.id === id);
      if (!block) return;

      console.log("block", block);

      if (e.key === "/") {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        const editorRect = editorRef.current?.getBoundingClientRect();

        if (editorRect) {
          // Calculate position relative to the editor container
          const x = rect.left - editorRect.left;
          const y = rect.bottom - editorRect.top;

          setMenuState({
            show: true,
            query: "",
            position: { x, y },
          });
        }
        return;
      }

      if (e.key === "Enter" && !e.shiftKey) {
        const newBlock: BlockType = {
          id: Date.now().toString(),
          type: "paragraph",
          content: "",
        };

        const index = blocks.findIndex((b) => b.id === id);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        onChange(newBlocks);
        setActiveBlockId(newBlock.id);
      }

      if (e.key === "Backspace" && !block.content && blocks.length > 1) {
        e.preventDefault();
        const index = blocks.findIndex((b) => b.id === id);
        const newBlocks = blocks.filter((b) => b.id !== id);
        onChange(newBlocks);
        setActiveBlockId(blocks[index - 1]?.id || blocks[index + 1]?.id);
      }
    },
    [blocks, onChange]
  );

  const handleBlockSelect = (type: BlockType["type"]) => {
    if (!activeBlockId) return;

    onChange(
      blocks.map((block) =>
        block.id === activeBlockId ? { ...block, type } : block
      )
    );
    setMenuState((prev) => ({ ...prev, show: false }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  return (
    <div ref={editorRef} className="relative min-h-[300px] space-y-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              isActive={block.id === activeBlockId}
              onChange={(content) => handleBlockChange(block.id, content)}
              onKeyDown={(e) => handleKeyDown(block.id, e)}
              onFocus={() => setActiveBlockId(block.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {menuState.show && (
        <div ref={menuRef}>
          <BlockMenu
            query={menuState.query}
            onSelect={handleBlockSelect}
            position={menuState.position}
          />
        </div>
      )}
    </div>
  );
}
