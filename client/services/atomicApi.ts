// Atomic API - Handle each step completely separately to isolate the issue

export async function atomicRegister(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
}) {
  console.log("⚛️ ATOMIC REGISTER START");
  console.log("Data:", { ...userData, password: "[HIDDEN]" });

  // Step 1: Prepare the request
  const requestUrl = "/api/auth/register";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  console.log("Request URL:", requestUrl);
  console.log("Request options:", {
    method: requestOptions.method,
    headers: requestOptions.headers,
    bodyLength: requestOptions.body.length,
  });

  // Step 2: Make the fetch request
  let fetchResponse;
  try {
    console.log("Making fetch request...");
    fetchResponse = await fetch(requestUrl, requestOptions);
    console.log("Fetch completed successfully");
  } catch (fetchError) {
    console.error("Fetch failed:", fetchError);
    throw new Error(`Network request failed: ${fetchError}`);
  }

  // Step 3: Check basic response properties
  console.log("Response status:", fetchResponse.status);
  console.log("Response statusText:", fetchResponse.statusText);
  console.log("Response ok:", fetchResponse.ok);
  console.log("Response type:", fetchResponse.type);
  console.log("Response bodyUsed:", fetchResponse.bodyUsed);

  // Step 4: Read the response body (this is where the error usually happens)
  let responseBodyText;
  try {
    console.log("About to read response body...");
    console.log("Body used before read:", fetchResponse.bodyUsed);
    responseBodyText = await fetchResponse.text();
    console.log("Response body read successfully");
    console.log("Body length:", responseBodyText.length);
    console.log("Body used after read:", fetchResponse.bodyUsed);
  } catch (bodyError) {
    console.error("Body read failed:", bodyError);
    console.log("Response details:", {
      status: fetchResponse.status,
      ok: fetchResponse.ok,
      bodyUsed: fetchResponse.bodyUsed,
      type: fetchResponse.type,
    });
    throw new Error(`Failed to read response body: ${bodyError}`);
  }

  // Step 5: Log the raw response
  console.log("Raw response body:", responseBodyText.substring(0, 200));

  // Step 6: Handle error responses
  if (!fetchResponse.ok) {
    console.log("Response not OK, handling error...");

    let errorMessage = `Registration failed (${fetchResponse.status})`;

    if (responseBodyText && responseBodyText.trim()) {
      try {
        const errorData = JSON.parse(responseBodyText);
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.log("Error data parsed:", errorData);
      } catch (parseError) {
        console.log("Error response not JSON, using raw text");
        errorMessage = responseBodyText;
      }
    }

    console.error("Registration failed:", errorMessage);
    throw new Error(errorMessage);
  }

  // Step 7: Parse successful response
  if (!responseBodyText || !responseBodyText.trim()) {
    console.error("Empty response body");
    throw new Error("Empty response from server");
  }

  let responseData;
  try {
    console.log("Parsing successful response JSON...");
    responseData = JSON.parse(responseBodyText);
    console.log("JSON parsed successfully");
  } catch (parseError) {
    console.error("JSON parse failed:", parseError);
    console.log("Response text that failed to parse:", responseBodyText);
    throw new Error("Invalid JSON response from server");
  }

  console.log("✅ Registration completed successfully");
  return responseData;
}

export async function atomicLogin(email: string, password: string) {
  console.log("⚛️ ATOMIC LOGIN START");
  console.log("Email:", email);

  // Step 1: Prepare the request
  const requestUrl = "/api/auth/login";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  console.log("Request URL:", requestUrl);
  console.log("Request options:", {
    method: requestOptions.method,
    headers: requestOptions.headers,
    bodyLength: requestOptions.body.length,
  });

  // Step 2: Make the fetch request
  let fetchResponse;
  try {
    console.log("Making fetch request...");
    fetchResponse = await fetch(requestUrl, requestOptions);
    console.log("Fetch completed successfully");
  } catch (fetchError) {
    console.error("Fetch failed:", fetchError);
    throw new Error(`Network request failed: ${fetchError}`);
  }

  // Step 3: Check basic response properties
  console.log("Response status:", fetchResponse.status);
  console.log("Response statusText:", fetchResponse.statusText);
  console.log("Response ok:", fetchResponse.ok);
  console.log("Response type:", fetchResponse.type);
  console.log("Response bodyUsed:", fetchResponse.bodyUsed);

  // Step 4: Read the response body (this is where the error usually happens)
  let responseBodyText;
  try {
    console.log("About to read response body...");
    console.log("Body used before read:", fetchResponse.bodyUsed);
    responseBodyText = await fetchResponse.text();
    console.log("Response body read successfully");
    console.log("Body length:", responseBodyText.length);
    console.log("Body used after read:", fetchResponse.bodyUsed);
  } catch (bodyError) {
    console.error("Body read failed:", bodyError);
    console.log("Response details:", {
      status: fetchResponse.status,
      ok: fetchResponse.ok,
      bodyUsed: fetchResponse.bodyUsed,
      type: fetchResponse.type,
    });
    throw new Error(`Failed to read response body: ${bodyError}`);
  }

  // Step 5: Log the raw response
  console.log("Raw response body:", responseBodyText.substring(0, 200));

  // Step 6: Handle error responses
  if (!fetchResponse.ok) {
    console.log("Response not OK, handling error...");

    let errorMessage = `Login failed (${fetchResponse.status})`;

    if (responseBodyText && responseBodyText.trim()) {
      try {
        const errorData = JSON.parse(responseBodyText);
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.log("Error data parsed:", errorData);
      } catch (parseError) {
        console.log("Error response not JSON, using raw text");
        errorMessage = responseBodyText;
      }
    }

    console.error("Login failed:", errorMessage);
    throw new Error(errorMessage);
  }

  // Step 7: Parse successful response
  if (!responseBodyText || !responseBodyText.trim()) {
    console.error("Empty response body");
    throw new Error("Empty response from server");
  }

  let responseData;
  try {
    console.log("Parsing successful response JSON...");
    responseData = JSON.parse(responseBodyText);
    console.log("JSON parsed successfully");
  } catch (parseError) {
    console.error("JSON parse failed:", parseError);
    console.log("Response text that failed to parse:", responseBodyText);
    throw new Error("Invalid JSON response from server");
  }

  console.log("✅ Login completed successfully");
  return responseData;
}

export async function atomicPing() {
  console.log("⚛️ ATOMIC PING START");

  // Step 1: Prepare the request
  const requestUrl = "/api/ping";

  console.log("Request URL:", requestUrl);

  // Step 2: Make the fetch request
  let fetchResponse;
  try {
    console.log("Making ping request...");
    fetchResponse = await fetch(requestUrl);
    console.log("Ping fetch completed");
  } catch (fetchError) {
    console.error("Ping fetch failed:", fetchError);
    return false;
  }

  // Step 3: Check basic response properties
  console.log("Ping response status:", fetchResponse.status);
  console.log("Ping response ok:", fetchResponse.ok);
  console.log("Ping response bodyUsed:", fetchResponse.bodyUsed);

  // Step 4: Read the response body
  let responseBodyText;
  try {
    console.log("About to read ping response body...");
    responseBodyText = await fetchResponse.text();
    console.log("Ping response body read successfully");
  } catch (bodyError) {
    console.error("Ping body read failed:", bodyError);
    return false;
  }

  // Step 5: Check result
  if (fetchResponse.ok) {
    console.log("✅ Ping successful");
    return true;
  } else {
    console.log("❌ Ping failed");
    return false;
  }
}
