import React, { useState } from "react";

export default function ApiTest() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const testEndpoint = async (
    url: string,
    method: string = "GET",
    data?: any,
  ) => {
    try {
      addResult(`Testing ${method} ${url}...`);

      const xhr = new XMLHttpRequest();
      const fullUrl = `${window.location.origin}${url}`;

      await new Promise((resolve, reject) => {
        xhr.open(method, fullUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
              addResult(
                `✅ ${method} ${url} - Status: ${xhr.status} - Response: ${xhr.responseText.substring(0, 200)}...`,
              );
              resolve(xhr.responseText);
            } else {
              addResult(
                `❌ ${method} ${url} - Status: ${xhr.status} - ${xhr.statusText} - Response: ${xhr.responseText}`,
              );
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };

        xhr.onerror = () => {
          addResult(`❌ ${method} ${url} - Network error`);
          reject(new Error("Network error"));
        };

        if (data) {
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send();
        }
      });
    } catch (error) {
      addResult(`❌ ${method} ${url} - Error: ${error}`);
    }
  };

  const testBasicConnectivity = async () => {
    setResults([]);
    addResult("Starting API connectivity tests...");

    // Test basic endpoints
    await testEndpoint("/api/ping");
    await testEndpoint("/api/test");
    await testEndpoint("/api/test", "POST", { test: "data" });
  };

  const testAuthEndpoints = async () => {
    addResult("Testing auth endpoints...");

    // Test auth endpoints (these should return appropriate errors for invalid data)
    await testEndpoint("/api/auth/register", "POST", {
      email: "test@example.com",
      password: "test123",
      firstName: "Test",
      lastName: "User",
    });

    await testEndpoint("/api/auth/login", "POST", {
      email: "test@example.com",
      password: "test123",
    });
  };

  const checkServerLogs = () => {
    addResult(
      "Check the development server console for Express server startup messages...",
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Connectivity Test</h1>

      <div className="space-y-4 mb-6">
        <button
          onClick={testBasicConnectivity}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Basic Connectivity
        </button>

        <button
          onClick={testAuthEndpoints}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Auth Endpoints
        </button>

        <button
          onClick={checkServerLogs}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Check Server Logs
        </button>

        <button
          onClick={() => setResults([])}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-gray-500">
            Click a test button to start testing...
          </div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="mb-1">
              {result}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Expected behavior:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>/api/ping should return 200 with API info</li>
          <li>/api/test should return 200 with test response</li>
          <li>
            /api/auth/* endpoints should return appropriate responses (even for
            invalid data)
          </li>
          <li>If all endpoints return 404, the Express server isn't running</li>
        </ul>
      </div>
    </div>
  );
}
