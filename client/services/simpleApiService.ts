// Simplified API service to avoid body stream issues

export const simpleRegister = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
}) => {
  try {
    console.log("Starting registration with simple API...");
    console.log("Data:", { ...userData, password: "[HIDDEN]" });

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    // Read the response body as text first
    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (!response.ok) {
      let errorMessage = `Registration failed (${response.status})`;

      try {
        if (responseText) {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        }
      } catch {
        errorMessage = responseText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Parse the successful response
    const data = JSON.parse(responseText);
    console.log("Registration successful!");

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const simpleLogin = async (email: string, password: string) => {
  try {
    console.log("Starting login with simple API...");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response status:", response.status);

    // Read the response body as text first
    const responseText = await response.text();
    console.log("Login response body:", responseText);

    if (!response.ok) {
      let errorMessage = `Login failed (${response.status})`;

      try {
        if (responseText) {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        }
      } catch {
        errorMessage = responseText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Parse the successful response
    const data = JSON.parse(responseText);
    console.log("Login successful!");

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
