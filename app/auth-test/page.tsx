"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, RegisterLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useEffect, useState } from "react";

export default function AuthTestPage() {
  const { user, isAuthenticated, isLoading, error } = useKindeBrowserClient();
  const [authHistory, setAuthHistory] = useState<string[]>([]);
  
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    const status = `${timestamp}: Loading=${isLoading}, Auth=${isAuthenticated}, User=${user?.id || 'none'}`;
    setAuthHistory(prev => [...prev.slice(-9), status]);
  }, [isLoading, isAuthenticated, user]);

  const handleLoginClick = () => {
    console.log("Login button clicked");
    setAuthHistory(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: Login clicked`]);
  };

  const handleRegisterClick = () => {
    console.log("Register button clicked");
    setAuthHistory(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: Register clicked`]);
  };

  return (
    <div className="p-8 space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold">Auth Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold">Current Auth State:</h2>
        <p>Is Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
        <p>Is Loading: {isLoading ? "⏳ Yes" : "✅ No"}</p>
        <p>Error: {error ? `❌ ${JSON.stringify(error)}` : "✅ None"}</p>
        <div className="mt-2">
          <p className="font-semibold">User Object:</p>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {user ? JSON.stringify(user, null, 2) : "No user data"}
          </pre>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded">
        <h2 className="font-semibold">Auth History (Last 10):</h2>
        <div className="text-sm font-mono">
          {authHistory.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      </div>

      <div className="space-x-4">
        <LoginLink 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleLoginClick}
        >
          Sign In
        </LoginLink>
        
        <RegisterLink 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleRegisterClick}
        >
          Sign Up
        </RegisterLink>
        
        {isAuthenticated && (
          <LogoutLink className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </LogoutLink>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded">
        <h2 className="font-semibold">Environment Check:</h2>
        <div className="text-sm">
          <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
          <p>Protocol: {typeof window !== 'undefined' ? window.location.protocol : 'N/A'}</p>
          <p>Host: {typeof window !== 'undefined' ? window.location.host : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
