import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockEditor from '../BlockEditor';

describe('BlockEditor', () => {
  const mockBlocks = [
    { id: '1', type: 'paragraph', content: 'Test content' },
    { id: '2', type: 'heading1', content: 'Test heading' },
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all blocks', () => {
    render(<BlockEditor blocks={mockBlocks} onChange={mockOnChange} />);
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByText('Test heading')).toBeInTheDocument();
  });

  it('applies correct styles to different block types', () => {
    render(<BlockEditor blocks={mockBlocks} onChange={mockOnChange} />);
    
    const heading = screen.getByText('Test heading');
    expect(heading.parentElement).toHaveClass('text-3xl', 'font-bold');
  });

  it('shows block menu on / key press', async () => {
    const user = userEvent.setup();
    render(<BlockEditor blocks={mockBlocks} onChange={mockOnChange} />);
    
    const firstBlock = screen.getByText('Test content');
    await user.click(firstBlock);
    await user.keyboard('/');
    
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
  });

  it('creates new block on Enter', async () => {
    const user = userEvent.setup();
    render(<BlockEditor blocks={mockBlocks} onChange={mockOnChange} />);
    
    const firstBlock = screen.getByText('Test content');
    await user.click(firstBlock);
    await user.keyboard('{Enter}');
    
    expect(mockOnChange).toHaveBeenCalled();
    const newBlocks = mockOnChange.mock.calls[0][0];
    expect(newBlocks).toHaveLength(3);
  });
});