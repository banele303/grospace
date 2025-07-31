'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

if (typeof window !== 'undefined') {
  try {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
    
    if (posthogKey && posthogKey.trim() !== '') {
      console.debug('Initializing PostHog with host:', posthogHost);
      
      posthog.init(posthogKey, {
        api_host: posthogHost,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug();
        },
        capture_pageview: false, // We'll handle this manually
        autocapture: false, // Disable autocapture to reduce blocked requests
        respect_dnt: true, // Respect Do Not Track setting
        // PostHog doesn't have a direct error callback in the config
        // We'll handle errors elsewhere
      });
    } else {
      console.warn('PostHog key is not defined or empty in environment variables');
    }
  } catch (error) {
    // Silent fail for analytics - won't affect app functionality
    console.debug('PostHog initialization failed - analytics will be disabled', error);
  }
}

// Helper to check if analytics is blocked
const isAnalyticsBlocked = () => {
  // Return true if PostHog is not initialized or if we detect ad blockers
  if (typeof window === 'undefined') return true;
  
  // Check if PostHog key is available and not empty
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!posthogKey || posthogKey.trim() === '') {
    console.debug('PostHog disabled: No API key available');
    return true;
  }
  
  // Check if PostHog is properly initialized
  if (!posthog.__loaded) {
    console.debug('PostHog disabled: Not properly loaded');
    return true;
  }
  
  // Check if we're in a local development environment
  if (typeof window !== 'undefined' && 
      window.location.hostname === 'localhost' && 
      process.env.NODE_ENV === 'development') {
    console.debug('PostHog running in development mode');
  }
  
  return false; // Allow analytics if all checks pass
};

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      try {
        if (!isAnalyticsBlocked()) {
          let url = window.origin + pathname;
          if (searchParams?.toString()) {
            url = url + `?${searchParams.toString()}`;
          }
          
          // Make sure PostHog is available before attempting to capture
          if (posthog && typeof posthog.capture === 'function') {
            posthog.capture('$pageview', {
              $current_url: url,
            });
          }
        }
      } catch (error) {
        // Silent fail for analytics - won't affect app functionality
        console.debug('Failed to capture page view:', error);
      }
    }
  }, [pathname, searchParams]);

  return <Provider client={posthog}>{children}</Provider>;
} 