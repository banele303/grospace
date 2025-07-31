'use client';

import { useEffect, useRef } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

/**
 * AuthSync component that synchronizes Kinde auth state with our database
 * This component should be included in layouts where authentication is required
 */
export function AuthSync() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const hasSynced = useRef(false);
  const syncInProgress = useRef(false);

  useEffect(() => {
    // Only run sync once when user is authenticated and not loading
    if (isAuthenticated && !isLoading && user && !hasSynced.current && !syncInProgress.current) {
      hasSynced.current = true;
      syncInProgress.current = true;
      
      console.log('AuthSync: User authenticated, syncing with database...');
      
      // Call the sync API to ensure the user exists in our database
      fetch('/api/auth/sync', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Sync failed: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('AuthSync: User synced successfully', data);
        })
        .catch(error => {
          console.error('AuthSync: Error syncing user', error);
          // Reset flag to allow retry on next render
          hasSynced.current = false;
        })
        .finally(() => {
          syncInProgress.current = false;
        });
    }
    
    // Reset sync flag when user logs out
    if (!isAuthenticated && !isLoading) {
      hasSynced.current = false;
    }
  }, [isAuthenticated, isLoading, user]);

  return null; // This component doesn't render anything
}
