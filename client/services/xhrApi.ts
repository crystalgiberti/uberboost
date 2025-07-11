interface XHRResponse {
  ok: boolean;
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
}

class XHRClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Auto-detect the base URL from current location
    if (typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);
      // Use the same origin and port since Express is integrated with Vite
      this.baseUrl = baseUrl || currentUrl.origin;
    } else {
      this.baseUrl = baseUrl || "http://localhost:8080";
    }
    console.log("XHR Client initialized with baseUrl:", this.baseUrl);
  }

  private makeRequest(
    method: string,
    url: string,
    data?: any,
    headers: Record<string, string> = {},
  ): Promise<XHRResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;

      xhr.open(method, fullUrl, true);

      // Set headers
      xhr.setRequestHeader("Content-Type", "application/json");
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          console.log(`XHR Response for ${method} ${fullUrl}:`, {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            readyState: xhr.readyState,
          });

          // Handle CORS/network errors (status 0)
          if (xhr.status === 0) {
            const errorMsg = `Network error or CORS issue when accessing ${fullUrl}. Check if server is running and CORS is configured properly.`;
            console.error(errorMsg);
            reject(new Error(errorMsg));
            return;
          }

          let responseData;

          try {
            responseData = xhr.responseText
              ? JSON.parse(xhr.responseText)
              : null;
          } catch (e) {
            responseData = xhr.responseText;
          }

          const response: XHRResponse = {
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            data: responseData,
            headers: this.parseHeaders(xhr.getAllResponseHeaders()),
          };

          if (response.ok) {
            resolve(response);
          } else {
            reject(
              new Error(
                `HTTP ${xhr.status}: ${xhr.statusText}${responseData ? ` - ${JSON.stringify(responseData)}` : ""}`,
              ),
            );
          }
        }
      };

      xhr.onerror = (event) => {
        console.error(`XHR Error for ${method} ${fullUrl}:`, event);
        reject(
          new Error(
            `Network request failed for ${fullUrl}. Check CORS configuration and server availability.`,
          ),
        );
      };

      xhr.ontimeout = () => {
        console.error(`XHR Timeout for ${method} ${fullUrl}`);
        reject(new Error(`Request timeout for ${fullUrl}`));
      };

      xhr.timeout = 10000; // 10 second timeout

      // Send request
      console.log(`Sending XHR ${method} to ${fullUrl}`, data ? { data } : {});

      try {
        if (data) {
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send();
        }
      } catch (error) {
        console.error(`Failed to send XHR request:`, error);
        reject(error);
      }
    });
  }

  private parseHeaders(headerString: string): Record<string, string> {
    const headers: Record<string, string> = {};
    if (!headerString) return headers;

    headerString.split("\r\n").forEach((line) => {
      const parts = line.split(": ");
      if (parts.length === 2) {
        headers[parts[0].toLowerCase()] = parts[1];
      }
    });

    return headers;
  }

  async get(
    url: string,
    headers?: Record<string, string>,
  ): Promise<XHRResponse> {
    return this.makeRequest("GET", url, undefined, headers);
  }

  async post(
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<XHRResponse> {
    return this.makeRequest("POST", url, data, headers);
  }

  async put(
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<XHRResponse> {
    return this.makeRequest("PUT", url, data, headers);
  }

  async delete(
    url: string,
    headers?: Record<string, string>,
  ): Promise<XHRResponse> {
    return this.makeRequest("DELETE", url, undefined, headers);
  }
}

// Auth-specific API functions
export class XHRAuthAPI {
  private client: XHRClient;

  constructor() {
    this.client = new XHRClient();
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ user: any; token: string }> {
    try {
      const response = await this.client.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("XHR Registration error:", error);
      throw error;
    }
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: any; token: string }> {
    try {
      const response = await this.client.post("/api/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("XHR Login error:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await this.client.post("/api/auth/logout", {}, headers);
    } catch (error) {
      console.error("XHR Logout error:", error);
      throw error;
    }
  }

  async getProfile(): Promise<any> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token");

      const response = await this.client.get("/api/users/profile", {
        Authorization: `Bearer ${token}`,
      });
      return response.data;
    } catch (error) {
      console.error("XHR Get profile error:", error);
      throw error;
    }
  }

  async updateProfile(profileData: any): Promise<any> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token");

      const response = await this.client.put(
        "/api/users/profile",
        profileData,
        {
          Authorization: `Bearer ${token}`,
        },
      );
      return response.data;
    } catch (error) {
      console.error("XHR Update profile error:", error);
      throw error;
    }
  }
}

export const xhrAuthAPI = new XHRAuthAPI();
