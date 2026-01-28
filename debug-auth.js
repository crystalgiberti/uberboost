// Debug script to test registration endpoint
const testRegistration = async () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
    phone: "555-1234",
    city: "Jacksonville",
  };

  try {
    console.log("Testing registration endpoint...");
    console.log("Payload:", { ...testUser, password: "[HIDDEN]" });

    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    const data = await response.text(); // Use text() to avoid consuming body twice
    console.log("Response body:", data);

    if (response.ok) {
      console.log("✅ Registration successful!");
    } else {
      console.log("❌ Registration failed");
    }
  } catch (error) {
    console.error("❌ Request failed:", error);
  }
};

// For browser testing
if (typeof window !== "undefined") {
  window.testRegistration = testRegistration;
}

// For Node.js testing
if (typeof module !== "undefined") {
  module.exports = { testRegistration };
}

console.log("Debug script loaded. Call testRegistration() to test.");
