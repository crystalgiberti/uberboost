// XHR-based API to completely bypass fetch interference

function createXHR(
  method: string,
  url: string,
  data?: any,
): Promise<{ status: number; responseText: string; ok: boolean }> {
  return new Promise((resolve, reject) => {
    console.log(`🔧 XHR Request: ${method} ${url}`);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(`🔧 XHR Response: ${xhr.status} ${xhr.statusText}`);
        console.log(`🔧 XHR Response text length: ${xhr.responseText.length}`);

        resolve({
          status: xhr.status,
          responseText: xhr.responseText,
          ok: xhr.status >= 200 && xhr.status < 300,
        });
      }
    };

    xhr.onerror = function () {
      console.error(`🔧 XHR Error for ${method} ${url}`);
      reject(new Error(`XHR request failed: ${method} ${url}`));
    };

    xhr.ontimeout = function () {
      console.error(`🔧 XHR Timeout for ${method} ${url}`);
      reject(new Error(`XHR request timeout: ${method} ${url}`));
    };

    try {
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.timeout = 30000; // 30 second timeout

      if (data) {
        const jsonData = JSON.stringify(data);
        console.log(`🔧 XHR Sending data length: ${jsonData.length}`);
        xhr.send(jsonData);
      } else {
        xhr.send();
      }
    } catch (error) {
      console.error(`🔧 XHR Setup error:`, error);
      reject(error);
    }
  });
}

export async function xhrRegister(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
}) {
  console.log("🔧 === XHR REGISTER START ===");
  console.log("User data:", { ...userData, password: "[HIDDEN]" });

  try {
    const result = await createXHR("POST", "/api/auth/register", userData);

    console.log(`XHR Register result:`, {
      status: result.status,
      ok: result.ok,
      responseLength: result.responseText.length,
    });

    if (!result.ok) {
      let errorMessage = `Registration failed (${result.status})`;

      if (result.responseText) {
        try {
          const errorData = JSON.parse(result.responseText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          errorMessage = result.responseText;
        }
      }

      console.error("XHR Registration failed:", errorMessage);
      throw new Error(errorMessage);
    }

    if (!result.responseText) {
      throw new Error("Empty response from server");
    }

    let responseData;
    try {
      responseData = JSON.parse(result.responseText);
    } catch (parseError) {
      console.error("XHR JSON parse failed:", parseError);
      throw new Error("Invalid JSON response from server");
    }

    console.log("✅ XHR Registration successful");
    return responseData;
  } catch (error) {
    console.error("❌ XHR Registration error:", error);
    throw error;
  }
}

export async function xhrLogin(email: string, password: string) {
  console.log("🔧 === XHR LOGIN START ===");
  console.log("Email:", email);

  try {
    const result = await createXHR("POST", "/api/auth/login", {
      email,
      password,
    });

    console.log(`XHR Login result:`, {
      status: result.status,
      ok: result.ok,
      responseLength: result.responseText.length,
    });

    if (!result.ok) {
      let errorMessage = `Login failed (${result.status})`;

      if (result.responseText) {
        try {
          const errorData = JSON.parse(result.responseText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          errorMessage = result.responseText;
        }
      }

      console.error("XHR Login failed:", errorMessage);
      throw new Error(errorMessage);
    }

    if (!result.responseText) {
      throw new Error("Empty response from server");
    }

    let responseData;
    try {
      responseData = JSON.parse(result.responseText);
    } catch (parseError) {
      console.error("XHR JSON parse failed:", parseError);
      throw new Error("Invalid JSON response from server");
    }

    console.log("✅ XHR Login successful");
    return responseData;
  } catch (error) {
    console.error("❌ XHR Login error:", error);
    throw error;
  }
}

export async function xhrPing() {
  console.log("🔧 === XHR PING START ===");

  try {
    const result = await createXHR("GET", "/api/ping");

    console.log(`XHR Ping result:`, {
      status: result.status,
      ok: result.ok,
      responseLength: result.responseText.length,
    });

    if (result.ok) {
      console.log("✅ XHR Ping successful");
      return true;
    } else {
      console.log("❌ XHR Ping failed");
      return false;
    }
  } catch (error) {
    console.error("❌ XHR Ping error:", error);
    return false;
  }
}

// Test function to verify XHR is working
export async function testXHR() {
  console.log("🔧 === XHR FUNCTIONALITY TEST ===");

  try {
    // Test 1: Simple GET
    console.log("Test 1: XHR GET request");
    const pingResult = await xhrPing();
    console.log(`Test 1 result: ${pingResult}`);

    // Test 2: POST with data
    console.log("Test 2: XHR POST request");
    const testResult = await createXHR("POST", "/api/test", { test: "data" });
    console.log(`Test 2 result:`, testResult);

    console.log("✅ XHR functionality test completed");
    return true;
  } catch (error) {
    console.error("❌ XHR functionality test failed:", error);
    return false;
  }
}
