import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "../Notes/NoteCard";

describe("NoteCard", () => {
  const mockNote = {
    id: "1",
    title: "Test Note",
    content: "Test Content",
    color: "bg-white",
    pinned: false,
  };

  const mockProps = {
    note: mockNote,
    onDelete: vi.fn(),
    onColorChange: vi.fn(),
  };

  it("renders note title and content", () => {
    render(<NoteCard {...mockProps} />);

    expect(screen.getByDisplayValue("Test Note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Content")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    render(<NoteCard {...mockProps} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith("1");
  });

  it("shows color picker when palette button is clicked", () => {
    render(<NoteCard {...mockProps} />);

    const paletteButton = screen.getByRole("button", { name: /palette/i });
    fireEvent.click(paletteButton);

    expect(screen.getAllByRole("button")).toHaveLength(8); // 6 colors + palette + delete
  });
});
