import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserList from '../UserList';

describe('UserList', () => {
  const mockUsers = [
    { id: '1', name: 'John', color: '#B5DEFF', lastActive: new Date() },
    { id: '2', name: 'Jane', color: '#FFB5E8', lastActive: new Date() },
  ];

  it('renders all users', () => {
    render(<UserList users={mockUsers} />);
    
    const userAvatars = screen.getAllByTitle(/John|Jane/);
    expect(userAvatars).toHaveLength(2);
  });

  it('displays user initials', () => {
    render(<UserList users={mockUsers} />);
    
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('applies user colors to avatars', () => {
    render(<UserList users={mockUsers} />);
    
    const avatars = screen.getAllByTitle(/John|Jane/);
    expect(avatars[0]).toHaveStyle({ backgroundColor: '#B5DEFF' });
    expect(avatars[1]).toHaveStyle({ backgroundColor: '#FFB5E8' });
  });
});