import React from 'react';
import type { User } from '../types';

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {users.map((user) => (
        <div
          key={user.id}
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-sm font-medium"
          style={{ backgroundColor: user.color }}
          title={`${user.name} - ${new Date(user.lastActive).toLocaleTimeString()}`}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      ))}
    </div>
  );
}