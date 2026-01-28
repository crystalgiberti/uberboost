// Ultra-simple API service - absolutely minimal approach

async function basicApiCall(
  url: string,
  options: RequestInit = {},
): Promise<any> {
  console.log(`🚀 Basic API call to: ${url}`);

  let response: Response;
  let responseBody: string;

  try {
    // Step 1: Make the request
    response = await fetch(url, options);
    console.log(`📡 Response status: ${response.status}`);

    // Step 2: Read the body immediately and completely
    responseBody = await response.text();
    console.log(`📝 Response body length: ${responseBody.length}`);
    console.log(
      `📄 Response body preview: ${responseBody.substring(0, 100)}...`,
    );
  } catch (fetchError) {
    console.error(`❌ Fetch failed:`, fetchError);
    throw new Error(`Network request failed: ${fetchError}`);
  }

  // Step 3: Parse the response
  let parsedData = null;
  if (responseBody) {
    try {
      parsedData = JSON.parse(responseBody);
      console.log(`✅ JSON parsed successfully`);
    } catch (parseError) {
      console.warn(`⚠️ JSON parse failed, using raw text:`, parseError);
      parsedData = responseBody;
    }
  }

  // Step 4: Handle the result
  const result = {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    body: responseBody,
    data: parsedData,
  };

  console.log(`📊 Final result:`, {
    ok: result.ok,
    status: result.status,
    hasBody: !!result.body,
    hasData: !!result.data,
  });

  return result;
}

export const simpleRegister = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
}) => {
  console.log(`🔥 === SIMPLE REGISTER START ===`);
  console.log(`👤 User data:`, { ...userData, password: "[HIDDEN]" });

  try {
    const result = await basicApiCall("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!result.ok) {
      const errorMessage =
        result.data?.error ||
        result.body ||
        `Registration failed (${result.status})`;
      console.error(`❌ Registration failed:`, errorMessage);
      throw new Error(errorMessage);
    }

    if (!result.data) {
      console.error(`❌ No data in successful response`);
      throw new Error("No data received from server");
    }

    console.log(`✅ Registration successful!`);
    return result.data;
  } catch (error) {
    console.error(`🔥 Registration error:`, error);
    throw error;
  }
};

export const simpleLogin = async (email: string, password: string) => {
  console.log(`🔥 === SIMPLE LOGIN START ===`);
  console.log(`📧 Email:`, email);

  try {
    const result = await basicApiCall("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!result.ok) {
      const errorMessage =
        result.data?.error || result.body || `Login failed (${result.status})`;
      console.error(`❌ Login failed:`, errorMessage);
      throw new Error(errorMessage);
    }

    if (!result.data) {
      console.error(`❌ No data in successful response`);
      throw new Error("No data received from server");
    }

    console.log(`✅ Login successful!`);
    return result.data;
  } catch (error) {
    console.error(`🔥 Login error:`, error);
    throw error;
  }
};

export const testApiConnection = async () => {
  console.log(`🔥 === API CONNECTION TEST ===`);

  try {
    const result = await basicApiCall("/api/ping");

    if (result.ok && result.data) {
      console.log(`✅ API connection working!`);
      return true;
    } else {
      console.log(`❌ API connection failed`);
      return false;
    }
  } catch (error) {
    console.error(`🔥 API connection error:`, error);
    return false;
  }
};

// Export the basic function for direct testing
export { basicApiCall };
