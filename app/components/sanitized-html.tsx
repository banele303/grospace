'use client';

import DOMPurify from 'isomorphic-dompurify';

interface SanitizedHtmlProps {
  html: string;
  className?: string;
  truncate?: number;
}

/**
 * A production-ready component that safely renders HTML content
 * Uses isomorphic-dompurify to sanitize HTML in both client and server environments
 */
export default function SanitizedHtml({ 
  html, 
  className,
  truncate 
}: SanitizedHtmlProps) {
  // If no HTML, return fallback message
  if (!html) return <span className={className}>No description</span>;
  
  // Handle truncation if needed
  let processedHtml = html;
  if (truncate && html.length > truncate) {
    processedHtml = html.slice(0, truncate) + '...';
  }
  
  // Sanitize HTML using isomorphic-dompurify
  const sanitizedHtml = DOMPurify.sanitize(processedHtml, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe']
  });
  
  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
    />
  );
}
