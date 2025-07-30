// Kinde Auth Configuration
export const kindeConfig = {
  // Base URLs - ensure these are absolute
  siteUrl: process.env.KINDE_SITE_URL || 
    (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'http://localhost:3000'),
  
  // Default redirect URLs with absolute paths - ensure they have trailing slash
  defaultPostLoginRedirectUrl: process.env.KINDE_POST_LOGIN_REDIRECT_URL || 'http://localhost:3000/',
  defaultPostLogoutRedirectUrl: process.env.KINDE_POST_LOGOUT_REDIRECT_URL || 'http://localhost:3000/',
  
  // Ensure redirect URLs are absolute
  getAbsoluteUrl: (path: string): string => {
    // Always return absolute URL
    if (path.startsWith('http')) return path;
    
    const baseUrl = kindeConfig.siteUrl;
    // Ensure baseUrl doesn't end with slash if path starts with it
    const base = baseUrl.endsWith('/') && path.startsWith('/') 
      ? baseUrl.slice(0, -1) 
      : baseUrl;
      
    return `${base}${path}`;
  },
  
  // Validate and fix redirect URLs
  sanitizeRedirectUrl: (url: string | null): string => {
    if (!url) {
      // Always use absolute URL with http://
      return 'http://localhost:3000/';
    }
    
    if (url === '/') {
      return 'http://localhost:3000/';
    }
    
    return kindeConfig.getAbsoluteUrl(url);
  }
};

export default kindeConfig;
