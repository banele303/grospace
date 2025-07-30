'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

/**
 * AuthSync component that synchronizes Kinde auth state with our database
 * This component should be included in layouts where authentication is required
 */
export function AuthSync() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();

  useEffect(() => {
    // Only run sync when user is authenticated and not loading
    if (isAuthenticated && !isLoading && user) {
      console.log('AuthSync: User authenticated, syncing with database...');
      
      // Call the sync API to ensure the user exists in our database
      fetch('/api/auth/sync')
        .then(response => response.json())
        .then(data => {
          console.log('AuthSync: User synced successfully', data);
        })
        .catch(error => {
          console.error('AuthSync: Error syncing user', error);
        });
    }
  }, [isAuthenticated, isLoading, user]);

  return null; // This component doesn't render anything
}
