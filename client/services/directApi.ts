// Direct API functions - no abstractions, no wrappers, minimal complexity

export async function directRegister(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
}) {
  console.log("🎯 DIRECT REGISTER - Starting");
  console.log("Data:", { ...userData, password: "[HIDDEN]" });

  let response: Response;
  let bodyText: string;

  try {
    // Make the request
    response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Response status:", response.status);
    console.log("Response OK:", response.ok);

    // Read the body
    bodyText = await response.text();
    console.log("Body text:", bodyText);

    // Handle the response
    if (!response.ok) {
      let errorMessage = `Registration failed (${response.status})`;

      if (bodyText) {
        try {
          const errorData = JSON.parse(bodyText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Use raw text if JSON parsing fails
          errorMessage = bodyText;
        }
      }

      console.error("Registration failed:", errorMessage);
      throw new Error(errorMessage);
    }

    // Parse successful response
    if (!bodyText) {
      throw new Error("Empty response from server");
    }

    let responseData;
    try {
      responseData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("Failed to parse response JSON:", parseError);
      throw new Error("Invalid response from server");
    }

    console.log("✅ Registration successful");
    return responseData;
  } catch (error) {
    console.error("❌ Direct register failed:", error);
    throw error;
  }
}

export async function directLogin(email: string, password: string) {
  console.log("🎯 DIRECT LOGIN - Starting");
  console.log("Email:", email);

  let response: Response;
  let bodyText: string;

  try {
    // Make the request
    response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Response status:", response.status);
    console.log("Response OK:", response.ok);

    // Read the body
    bodyText = await response.text();
    console.log("Body text:", bodyText);

    // Handle the response
    if (!response.ok) {
      let errorMessage = `Login failed (${response.status})`;

      if (bodyText) {
        try {
          const errorData = JSON.parse(bodyText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Use raw text if JSON parsing fails
          errorMessage = bodyText;
        }
      }

      console.error("Login failed:", errorMessage);
      throw new Error(errorMessage);
    }

    // Parse successful response
    if (!bodyText) {
      throw new Error("Empty response from server");
    }

    let responseData;
    try {
      responseData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("Failed to parse response JSON:", parseError);
      throw new Error("Invalid response from server");
    }

    console.log("✅ Login successful");
    return responseData;
  } catch (error) {
    console.error("❌ Direct login failed:", error);
    throw error;
  }
}

export async function directPing() {
  console.log("🎯 DIRECT PING - Starting");

  let response: Response;
  let bodyText: string;

  try {
    // Make the request
    response = await fetch("/api/ping");

    console.log("Ping response status:", response.status);
    console.log("Ping response OK:", response.ok);

    // Read the body
    bodyText = await response.text();
    console.log("Ping body text:", bodyText);

    if (!response.ok) {
      console.error("Ping failed:", response.status);
      return false;
    }

    if (bodyText) {
      try {
        const data = JSON.parse(bodyText);
        console.log("✅ Ping successful:", data);
        return true;
      } catch {
        console.warn("Ping response not JSON, but OK");
        return true;
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Direct ping failed:", error);
    return false;
  }
}
