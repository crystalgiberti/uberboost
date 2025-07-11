// Ultra-safe API service to completely avoid body stream issues

async function safeApiCall(
  url: string,
  options: RequestInit = {},
): Promise<any> {
  console.log(`Making API call to: ${url}`);
  console.log("Options:", {
    ...options,
    body: options.body ? "[DATA]" : undefined,
  });

  try {
    const response = await fetch(url, options);
    console.log(`Response received: ${response.status} ${response.statusText}`);

    // Create a response reader that handles everything safely
    const responseReader = new Promise(async (resolve, reject) => {
      try {
        // Read the entire response as an ArrayBuffer to avoid any stream issues
        const arrayBuffer = await response.arrayBuffer();
        const text = new TextDecoder().decode(arrayBuffer);

        console.log("Raw response text:", text);

        resolve({
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          text: text,
          data: text
            ? (() => {
                try {
                  return JSON.parse(text);
                } catch {
                  return null;
                }
              })()
            : null,
        });
      } catch (error) {
        reject(error);
      }
    });

    const result = await responseReader;
    return result;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

export const simpleRegister = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
}) => {
  console.log("=== STARTING REGISTRATION ===");
  console.log("User data:", { ...userData, password: "[HIDDEN]" });

  try {
    const result = await safeApiCall("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Registration response:", {
      ok: result.ok,
      status: result.status,
      hasData: !!result.data,
    });

    if (!result.ok) {
      const errorMessage =
        result.data?.error ||
        result.text ||
        `Registration failed (${result.status})`;
      console.error("Registration failed:", errorMessage);
      throw new Error(errorMessage);
    }

    if (!result.data) {
      throw new Error("No data received from server");
    }

    console.log("✅ Registration successful!");
    return result.data;
  } catch (error) {
    console.error("❌ Registration error:", error);
    throw error;
  }
};

export const simpleLogin = async (email: string, password: string) => {
  console.log("=== STARTING LOGIN ===");
  console.log("Email:", email);

  try {
    const result = await safeApiCall("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response:", {
      ok: result.ok,
      status: result.status,
      hasData: !!result.data,
    });

    if (!result.ok) {
      const errorMessage =
        result.data?.error || result.text || `Login failed (${result.status})`;
      console.error("Login failed:", errorMessage);
      throw new Error(errorMessage);
    }

    if (!result.data) {
      throw new Error("No data received from server");
    }

    console.log("✅ Login successful!");
    return result.data;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
};

// Test function to verify API connectivity
export const testApiConnection = async () => {
  console.log("=== TESTING API CONNECTION ===");

  try {
    const result = await safeApiCall("/api/ping");

    console.log("Ping result:", result);

    if (result.ok && result.data) {
      console.log("✅ API connection working!");
      return true;
    } else {
      console.log("❌ API connection failed");
      return false;
    }
  } catch (error) {
    console.error("❌ API connection error:", error);
    return false;
  }
};
