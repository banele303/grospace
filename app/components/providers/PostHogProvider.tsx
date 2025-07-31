'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

if (typeof window !== 'undefined') {
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
      capture_pageview: false, // We'll handle this manually
      autocapture: false, // Disable autocapture to reduce blocked requests
      respect_dnt: true, // Respect Do Not Track setting
    });
  } catch (error) {
    // Silent fail for analytics - won't affect app functionality
    console.debug('PostHog initialization failed - analytics will be disabled');
  }
}

// Helper to check if analytics is blocked
const isAnalyticsBlocked = () => {
  // Return true if PostHog is not initialized or if we detect ad blockers
  if (typeof window === 'undefined') return true;
  
  try {
    // Quick test to see if analytics endpoints might be blocked
    const testRequest = new Request('https://us.i.posthog.com/test');
    return false; // We can't actually test this synchronously, so default to false
  } catch (e) {
    return true;
  }
};

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && !isAnalyticsBlocked()) {
      try {
        let url = window.origin + pathname;
        if (searchParams?.toString()) {
          url = url + `?${searchParams.toString()}`;
        }
        posthog.capture('$pageview', {
          $current_url: url,
        });
      } catch (error) {
        // Silent fail for analytics - won't affect app functionality
      }
    }
  }, [pathname, searchParams]);

  return <Provider client={posthog}>{children}</Provider>;
} 