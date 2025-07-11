// Debug version of XHR API with extensive logging

export async function testApiEndpoints() {
  const results: string[] = [];

  const addResult = (message: string) => {
    results.push(`[${new Date().toLocaleTimeString()}] ${message}`);
    console.log(message);
  };

  const testEndpoint = async (
    url: string,
    method: string = "GET",
    data?: any,
  ) => {
    try {
      addResult(`🔍 Testing ${method} ${url}...`);

      const xhr = new XMLHttpRequest();
      const fullUrl = `${window.location.origin}${url}`;

      addResult(`📍 Full URL: ${fullUrl}`);

      const promise = new Promise((resolve, reject) => {
        xhr.open(method, fullUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
          addResult(`🔄 ReadyState: ${xhr.readyState}, Status: ${xhr.status}`);

          if (xhr.readyState === XMLHttpRequest.DONE) {
            addResult(`📊 Final Status: ${xhr.status} ${xhr.statusText}`);
            addResult(`📝 Response: ${xhr.responseText}`);

            if (xhr.status >= 200 && xhr.status < 300) {
              addResult(`✅ ${method} ${url} - SUCCESS`);
              resolve(xhr.responseText);
            } else {
              addResult(`❌ ${method} ${url} - FAILED`);
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };

        xhr.onerror = (event) => {
          addResult(`🚨 Network error: ${JSON.stringify(event)}`);
          reject(new Error("Network error"));
        };

        xhr.ontimeout = () => {
          addResult(`⏰ Request timeout`);
          reject(new Error("Timeout"));
        };

        xhr.timeout = 10000;

        if (data) {
          addResult(`📤 Sending data: ${JSON.stringify(data)}`);
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send();
        }
      });

      await promise;
    } catch (error) {
      addResult(`💥 Error in ${method} ${url}: ${error}`);
    }
  };

  // Test basic connectivity
  addResult("🚀 Starting comprehensive API tests...");
  await testEndpoint("/api/ping");
  await testEndpoint("/api/test");

  // Test auth endpoints
  await testEndpoint("/api/auth/login", "POST", {
    email: "test@example.com",
    password: "test123",
  });

  return results;
}

// Run tests immediately
export function runDebugTests() {
  testApiEndpoints().then((results) => {
    console.log("Debug test results:", results);
  });
}
