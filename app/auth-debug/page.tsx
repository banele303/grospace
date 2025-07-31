"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, RegisterLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useEffect, useState } from "react";

export default function AuthDebugPage() {
  const { user, isAuthenticated, isLoading, error } = useKindeBrowserClient();
  const [mounted, setMounted] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any[]>([]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const info = {
        timestamp: new Date().toLocaleTimeString(),
        isLoading,
        isAuthenticated,
        user: user ? { id: user.id, email: user.email } : null,
        error: error || null
      };
      setDebugInfo(prev => [...prev.slice(-9), info]);
      console.log("Auth State Change:", info);
    }
  }, [mounted, isLoading, isAuthenticated, user, error]);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  const testAuth = async () => {
    try {
      const response = await fetch('/api/auth/debug');
      const data = await response.json();
      console.log("Auth Debug API Response:", data);
      alert(`Server Auth State: ${data.authenticated ? 'Authenticated' : 'Not Authenticated'}`);
    } catch (error) {
      console.error("Auth debug API error:", error);
      alert("Failed to check server auth state");
    }
  };

  const checkCookies = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      console.log("Cookie Status:", data);
      alert(`Found ${data.kindeTokens.length} Kinde cookies`);
    } catch (error) {
      console.error("Cookie check error:", error);
      alert("Failed to check cookies");
    }
  };

  const clearCookies = () => {
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    alert("Cleared all cookies. Please refresh the page.");
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Authentication Debug</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Current Auth State:</h2>
        <div className="space-y-2">
          <p><strong>Loading:</strong> {isLoading ? "Yes" : "No"}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
          <p><strong>Error:</strong> {error ? `❌ ${JSON.stringify(error)}` : "✅ None"}</p>
          <p><strong>User ID:</strong> {user?.id || "None"}</p>
          <p><strong>Email:</strong> {user?.email || "None"}</p>
          <p><strong>Name:</strong> {user?.given_name} {user?.family_name}</p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Debug History:</h2>
        <div className="space-y-1 text-sm font-mono max-h-40 overflow-y-auto">
          {debugInfo.map((info, i) => (
            <div key={i} className="text-xs">
              {info.timestamp}: Loading={info.isLoading}, Auth={info.isAuthenticated}, User={info.user?.id || 'null'}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Authentication Actions:</h2>
        <div className="flex gap-4 flex-wrap">
          <LoginLink className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium">
            Sign In
          </LoginLink>
          
          <RegisterLink className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium">
            Sign Up
          </RegisterLink>
          
          <button 
            onClick={testAuth}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 font-medium"
          >
            Test Server Auth
          </button>

          <button 
            onClick={checkCookies}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 font-medium"
          >
            Check Cookies
          </button>

          <button 
            onClick={clearCookies}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 font-medium"
          >
            Clear Cookies
          </button>

          <a 
            href="/api/auth/login"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium"
          >
            Direct Login URL
          </a>
          
          {isAuthenticated && (
            <LogoutLink className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-medium">
              Logout
            </LogoutLink>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Info:</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Host:</strong> {window.location.host}</p>
          <p><strong>Protocol:</strong> {window.location.protocol}</p>
          <p><strong>Expected Callback:</strong> {window.location.origin}/api/auth/kinde_callback</p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">User Object (Raw):</h2>
        <pre className="bg-white p-4 rounded border overflow-auto text-sm">
          {user ? JSON.stringify(user, null, 2) : "No user data"}
        </pre>
      </div>
    </div>
  );
}
