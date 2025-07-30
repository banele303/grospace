"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export function AdminChecker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const checkAdminStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug/admin');
      const result = await response.json();
      
      setData(result);
    } catch (err) {
      setError('Failed to check admin status: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md mb-6">
      <h2 className="text-xl font-bold mb-4">Admin Status Checker</h2>
      
      <Button 
        onClick={checkAdminStatus}
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Check Admin Status'}
      </Button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      {data && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Results:</h3>
          <div className="bg-gray-50 p-3 rounded overflow-auto">
            <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
