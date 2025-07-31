'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useEffect, useState } from 'react';

export function AuthDebug() {
  const [mounted, setMounted] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowDebug(process.env.NODE_ENV === 'development');
  }, []);

  if (!mounted || !showDebug) {
    return null;
  }

  return <AuthDebugContent />;
}

function AuthDebugContent() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50 max-w-xs">
      <div className="font-mono text-xs">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>User ID: {user?.id || 'None'}</div>
        <div>Email: {user?.email || 'None'}</div>
      </div>
    </div>
  );
}
