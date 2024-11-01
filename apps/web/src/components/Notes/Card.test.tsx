import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "./Card";
import { Block } from "@/types";

describe("NoteCard", () => {
  const mockNote = {
    id: "1",
    title: "Test Note",
    content: "Test Content",
    color: "bg-white",
    blocks: [
      {
        type: "paragraph",
        content: "Test Content",
      } as Block,
    ],
    version: 1,
    created: new Date(),
    createdBy: "test-user",
    lastEdited: new Date(),
    lastEditedBy: "test-user",
  };

  const mockProps = {
    note: mockNote,
    onDelete: vi.fn(),
    onColorChange: vi.fn(),
    onUpdate: vi.fn(),
    onNoteClick: vi.fn(),
  };
  it("renders note title and content", () => {
    render(<NoteCard {...mockProps} note={mockNote} />);

    // Check if the note title is there as the value of the input
    expect(screen.getByDisplayValue("Test Note")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    render(<NoteCard {...mockProps} note={mockNote} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith("1");
  });

  it("shows color picker when palette button is clicked", () => {
    render(<NoteCard {...mockProps} note={mockNote} />);

    const paletteButton = screen.getByRole("button", { name: /palette/i });
    fireEvent.click(paletteButton);

    expect(screen.getAllByRole("button")).toHaveLength(8); // 6 colors + palette + delete
  });
});
