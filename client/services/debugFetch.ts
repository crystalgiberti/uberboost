// Debug fetch to isolate what's causing the body stream issues

export async function debugFetch() {
  console.log("🔍 DEBUG FETCH - Testing basic fetch functionality");

  // Test 1: Basic GET request
  try {
    console.log("Test 1: Basic GET request to /api/ping");
    const response1 = await fetch("/api/ping");
    console.log("✅ GET request successful:", response1.status);
    console.log("Body used before read:", response1.bodyUsed);

    const text1 = await response1.text();
    console.log("✅ GET response read successfully, length:", text1.length);
    console.log("Body used after read:", response1.bodyUsed);
  } catch (error) {
    console.error("❌ Test 1 failed:", error);
  }

  // Test 2: POST request with small body
  try {
    console.log("Test 2: POST request with small body");
    const response2 = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: "data" }),
    });
    console.log("✅ POST request successful:", response2.status);
    console.log("Body used before read:", response2.bodyUsed);

    const text2 = await response2.text();
    console.log("✅ POST response read successfully, length:", text2.length);
    console.log("Body used after read:", response2.bodyUsed);
  } catch (error) {
    console.error("❌ Test 2 failed:", error);
  }

  // Test 3: Check if fetch is being intercepted
  try {
    console.log("Test 3: Checking fetch function");
    console.log("Fetch function:", typeof fetch);
    console.log("Fetch toString:", fetch.toString().substring(0, 100));

    // Check if there are any fetch interceptors
    console.log("Window fetch:", window.fetch === fetch);
    console.log(
      "Native fetch check:",
      fetch.toString().includes("[native code]"),
    );
  } catch (error) {
    console.error("❌ Test 3 failed:", error);
  }

  // Test 4: Check for service workers or other interceptors
  try {
    console.log("Test 4: Checking for interceptors");
    console.log(
      "Service worker registration:",
      navigator.serviceWorker?.controller?.scriptURL || "None",
    );
    console.log(
      "Number of service workers:",
      (await navigator.serviceWorker?.getRegistrations())?.length || 0,
    );
  } catch (error) {
    console.error("❌ Test 4 failed:", error);
  }

  console.log("🔍 Debug fetch tests completed");
}

export async function testMinimalAuth() {
  console.log("🧪 MINIMAL AUTH TEST");

  // Use the most basic possible approach
  const testData = {
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
  };

  try {
    console.log("Creating new Request object...");
    const request = new Request("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log("Request created successfully");
    console.log("Request URL:", request.url);
    console.log("Request method:", request.method);

    console.log("Making fetch with Request object...");
    const response = await fetch(request);

    console.log("Response received:", response.status);
    console.log("Response bodyUsed:", response.bodyUsed);

    console.log("Reading response...");
    const text = await response.text();

    console.log("✅ Minimal auth test successful");
    console.log("Response:", text.substring(0, 100));

    return { success: true, response: text };
  } catch (error) {
    console.error("❌ Minimal auth test failed:", error);
    return { success: false, error: error.message };
  }
}
