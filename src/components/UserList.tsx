'use client';

import { useState, useEffect } from 'react';
import { User, ApiResponse } from '@/lib/types';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data: ApiResponse<User[]> = await response.json();
      
      if (data.success && data.data) {
        setUsers(data.data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Users from API
      </h2>
      <Accordion.Root type="single" collapsible className="w-full space-y-2">
        {users.map((user) => (
          <Accordion.Item
            key={user.id}
            value={user.id.toString()}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <Accordion.Trigger className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{user.email}</p>
              </div>
              <ChevronDownIcon 
                className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" 
                aria-hidden="true"
              />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
              <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  User ID: {user.id}
                </p>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
