// API Service for communicating with the backend
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = "/api";
    this.token = localStorage.getItem("auth_token");
  }

  private async request(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log(`API Request: ${options.method || "GET"} ${url}`);
      console.log("Request headers:", headers);
      if (options.body) {
        console.log("Request body:", options.body);
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`API Response: ${response.status} ${response.statusText}`);

      // Read response as text first to avoid body stream issues
      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;

        try {
          if (responseText) {
            const errorData = JSON.parse(responseText);
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          }
        } catch (jsonError) {
          // If JSON parsing fails, use the text as is
          errorMessage =
            responseText ||
            `Request failed: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      // Parse the successful response
      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      // Re-throw known errors
      if (error instanceof Error) {
        throw error;
      }
      // Handle unknown errors
      throw new Error("Network request failed");
    }
  }

  // Authentication
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    city?: string;
  }) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    this.token = data.token;
    localStorage.setItem("auth_token", data.token);
    return data;
  }

  async login(credentials: { email: string; password: string }) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    this.token = data.token;
    localStorage.setItem("auth_token", data.token);
    return data;
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      this.token = null;
      localStorage.removeItem("auth_token");
    }
  }

  async getMe() {
    return this.request("/auth/me");
  }

  // User Profile & Settings
  async getProfile() {
    return this.request("/users/profile");
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
  }) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async getSettings() {
    return this.request("/users/settings");
  }

  async updateSettings(settings: {
    dailyGoal?: number;
    preferredSurgeMin?: number;
    maxDriveDistance?: number;
    notificationsEnabled?: boolean;
    voiceEnabled?: boolean;
    darkMode?: boolean;
    settingsJson?: Record<string, any>;
  }) {
    return this.request("/users/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  async getDashboard() {
    return this.request("/users/dashboard");
  }

  // Rides
  async createRide(rideData: {
    vehicleId?: string;
    date: string;
    time: string;
    pickupLocation: string;
    dropoffLocation: string;
    rideType: "UberX" | "UberXL" | "Uber Pool" | "Uber Black";
    earnings: number;
    surge?: number;
    duration?: number;
    distance?: number;
    tips?: number;
    notes?: string;
    source?: "manual" | "voice" | "import";
  }) {
    return this.request("/rides", {
      method: "POST",
      body: JSON.stringify(rideData),
    });
  }

  async getRides(page = 1, limit = 50) {
    return this.request(`/rides?page=${page}&limit=${limit}`);
  }

  async getRideStats(period = "30") {
    return this.request(`/rides/stats?period=${period}`);
  }

  async deleteRide(rideId: string) {
    return this.request(`/rides/${rideId}`, { method: "DELETE" });
  }

  async createBulkRides(rides: any[]) {
    return this.request("/rides/bulk", {
      method: "POST",
      body: JSON.stringify(rides),
    });
  }

  async exportRides(format = "csv") {
    try {
      const response = await fetch(
        `${this.baseUrl}/rides/export?format=${format}`,
        {
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        },
      );

      if (!response.ok) {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || "Export failed");
        } catch {
          throw new Error(`Export failed with status ${response.status}`);
        }
      }

      if (format === "csv") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `uber-rides-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        return response.json();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Export request failed");
    }
  }

  // Vehicles
  async createVehicle(vehicleData: {
    year: number;
    make: string;
    model: string;
    color: string;
    licensePlate: string;
    mileage?: number;
    fuelType?: "gas" | "hybrid" | "electric";
    mpg?: number;
    isActive?: boolean;
  }) {
    return this.request("/vehicles", {
      method: "POST",
      body: JSON.stringify(vehicleData),
    });
  }

  async getVehicles() {
    return this.request("/vehicles");
  }

  async updateVehicle(vehicleId: string, vehicleData: any) {
    return this.request(`/vehicles/${vehicleId}`, {
      method: "PUT",
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(vehicleId: string) {
    return this.request(`/vehicles/${vehicleId}`, { method: "DELETE" });
  }

  async getVehicleStats(vehicleId: string) {
    return this.request(`/vehicles/${vehicleId}/stats`);
  }

  // Maintenance
  async createMaintenanceRecord(
    vehicleId: string,
    maintenanceData: {
      type: "oil_change" | "tire_rotation" | "inspection" | "repair" | "other";
      description: string;
      date: string;
      mileage: number;
      cost: number;
      location: string;
      nextDue?: number;
    },
  ) {
    return this.request(`/vehicles/${vehicleId}/maintenance`, {
      method: "POST",
      body: JSON.stringify(maintenanceData),
    });
  }

  async getMaintenanceRecords(vehicleId: string) {
    return this.request(`/vehicles/${vehicleId}/maintenance`);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }
}

export const apiService = new ApiService();
export default apiService;
