import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  // Rendering tests
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button.className).includes("bg-blue-600"); // Primary variant
  });

  it("renders different variants correctly", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    let button = screen.getByRole("button", { name: /secondary/i });
    expect(button.className).includes("bg-white");
    expect(button.className).includes("border-gray-300");

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button", { name: /ghost/i });
    expect(button.className).includes("bg-transparent");

    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole("button", { name: /danger/i });
    expect(button.className).includes("bg-red-600");

    rerender(<Button variant="success">Success</Button>);
    button = screen.getByRole("button", { name: /success/i });
    expect(button.className).includes("bg-green-600");
  });

  it("renders different sizes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole("button", { name: /small/i });
    expect(button.className).includes("px-3");
    expect(button.className).includes("py-1.5");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button", { name: /large/i });
    expect(button.className).includes("px-6");
    expect(button.className).includes("py-3");
  });

  it("applies fullWidth class when fullWidth prop is true", () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole("button", { name: /full width/i });
    expect(button.className).includes("w-full");
  });

  // Loading state tests
  it("shows loading spinner and disables button when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button", { name: /loading/i });

    expect(button).toBeDisabled();
    const spinner = button.querySelector("svg");
    expect(spinner).toBeInTheDocument();
  });

  // Icon tests
  it("renders with left and right icons", () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    const RightIcon = () => <span data-testid="right-icon">→</span>;

    render(
      <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        With Icons
      </Button>
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  // Disabled state tests
  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled();
  });

  // Event handler tests
  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn(); // Using Vitest's vi instead of Jest's jest
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Ref forwarding tests
  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Test</Button>);

    expect(ref.current).instanceOf(HTMLButtonElement);
  });

  // Custom class tests
  it("applies custom className correctly", () => {
    render(<Button className="custom-class">Custom Class</Button>);
    const button = screen.getByRole("button", { name: /custom class/i });
    expect(button.className).includes("custom-class");
  });
});
