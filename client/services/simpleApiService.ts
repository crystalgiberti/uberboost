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

    // Clone the response to avoid body stream issues
    const responseClone = response.clone();

    if (!response.ok) {
      let errorMessage = `Registration failed (${response.status})`;

      try {
        const errorText = await responseClone.text();
        console.log("Error response body:", errorText);

        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        }
      } catch (readError) {
        console.log("Could not read error response:", readError);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
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

    const responseClone = response.clone();

    if (!response.ok) {
      let errorMessage = `Login failed (${response.status})`;

      try {
        const errorText = await responseClone.text();
        console.log("Login error response:", errorText);

        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        }
      } catch (readError) {
        console.log("Could not read login error response:", readError);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Login successful!");

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
