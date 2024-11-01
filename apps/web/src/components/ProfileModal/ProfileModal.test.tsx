import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileModal from "./ProfileModal";

describe("ProfileModal", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders profile creation form", () => {
    render(<ProfileModal onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Welcome to Mosaic")).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByText(/choose your color/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start collaborating/i })
    ).toBeInTheDocument();
  });

  it("submits form with user input", async () => {
    const user = userEvent.setup();
    render(<ProfileModal onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/your name/i);
    await user.type(nameInput, "John Doe");

    const submitButton = screen.getByRole("button", {
      name: /start collaborating/i,
    });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      color: "#FFB5E8",
    });
  });

  it("disables submit button when name is empty", () => {
    render(<ProfileModal onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", {
      name: /start collaborating/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it("allows color selection", async () => {
    const user = userEvent.setup();
    render(<ProfileModal onSubmit={mockOnSubmit} />);

    const colorButtons = screen.getAllByRole("button").slice(0, 6); // First 6 buttons are color options
    await user.type(screen.getByLabelText(/your name/i), "John Doe");
    await user.click(colorButtons[1]); // Click second color
    await user.click(
      screen.getByRole("button", { name: /start collaborating/i })
    );

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      color: "#B5DEFF",
    });
  });
});
