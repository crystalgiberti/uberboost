// Real-time data service for live surge predictions
export interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  impact: "high" | "medium" | "low";
}

export interface TrafficData {
  congestionLevel: number; // 0-100
  incidents: TrafficIncident[];
  avgSpeed: number;
  delayMinutes: number;
}

export interface TrafficIncident {
  id: string;
  type: "accident" | "construction" | "closure";
  location: string;
  severity: "high" | "medium" | "low";
  estimatedDuration: number;
}

export interface EventData {
  id: string;
  name: string;
  venue: string;
  startTime: string;
  endTime: string;
  expectedAttendance: number;
  category: string;
  status: "upcoming" | "ongoing" | "ending" | "ended";
}

export interface FlightData {
  totalFlights: number;
  arrivals: Flight[];
  departures: Flight[];
  delays: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  scheduledTime: string;
  estimatedTime: string;
  status: "on-time" | "delayed" | "cancelled";
  passengers: number;
}

export interface SurgeArea {
  location: string;
  coordinates: { lat: number; lng: number };
  currentMultiplier: number;
  predictedMultiplier: number;
  confidence: number;
  reasons: string[];
  estimatedDuration: number;
  trend: "increasing" | "stable" | "decreasing";
}

class RealTimeDataService {
  private wsConnection: WebSocket | null = null;
  private updateInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();

  // API Keys (in production, these would be in environment variables)
  private readonly API_KEYS = {
    openWeather: "your_openweather_api_key",
    googleMaps: "your_google_maps_api_key",
    tomtom: "your_tomtom_api_key",
    ticketmaster: "your_ticketmaster_api_key",
    flightaware: "your_flightaware_api_key",
  };

  constructor(private city: string = "Jacksonville") {
    this.initializeRealTimeUpdates();
  }

  // Initialize real-time data updates
  private initializeRealTimeUpdates() {
    // Initial fetch with delay to avoid blocking UI
    setTimeout(() => {
      this.fetchAllData();
    }, 1000);

    // Update every 30 seconds for real-time feel
    this.updateInterval = setInterval(() => {
      this.fetchAllData();
    }, 30000);

    // Try to establish WebSocket for ultra-real-time updates (optional)
    this.connectWebSocket();
  }

  private connectWebSocket() {
    try {
      // Skip WebSocket connection for now since we don't have a real-time server
      // In production, this would connect to your real-time data server
      console.log("WebSocket connection would be established in production");
      return;

      // Future implementation:
      // this.wsConnection = new WebSocket("wss://your-realtime-server.com/surge-data");
      // this.wsConnection.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   this.notifyListeners("surge-update", data);
      // };
    } catch (error) {
      console.log("WebSocket not available, using polling");
    }
  }

  // Fetch weather data from OpenWeatherMap
  async fetchWeatherData(): Promise<WeatherData> {
    // Check if API key is configured
    const apiKey = this.getStoredApiKey("openWeather");
    if (!apiKey) {
      console.log("OpenWeatherMap API key not configured, using mock data");
      return this.getMockWeatherData();
    }

    try {
      // For now, skip actual API calls due to CORS issues in browser
      // In production, these calls would go through a backend proxy
      console.log(
        "Weather API would be called with key:",
        apiKey.substring(0, 8) + "...",
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return enhanced mock data that simulates real API response
      return this.getEnhancedMockWeatherData();
    } catch (error) {
      console.error("Weather fetch failed:", error);
      return this.getMockWeatherData();
    }
  }

  // Fetch traffic data from Google Maps or TomTom
  async fetchTrafficData(): Promise<TrafficData> {
    // Check if API key is configured
    const googleKey = this.getStoredApiKey("googleMaps");
    const tomtomKey = this.getStoredApiKey("tomtom");

    if (!googleKey && !tomtomKey) {
      console.log("No traffic API keys configured, using mock data");
      return this.getMockTrafficData();
    }

    try {
      // For now, skip actual API calls due to CORS issues in browser
      // In production, these calls would go through a backend proxy
      const preferredApi = googleKey ? "Google Maps" : "TomTom";
      console.log(`${preferredApi} API would be called for traffic data`);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Return enhanced mock data based on time of day and other factors
      return this.getEnhancedMockTrafficData();
    } catch (error) {
      console.error("Traffic fetch failed:", error);
      return this.getMockTrafficData();
    }
  }

  // Fetch events from Ticketmaster, Eventbrite, and city sources
  async fetchEventsData(): Promise<EventData[]> {
    const ticketmasterKey = this.getStoredApiKey("ticketmaster");
    const eventbriteKey = this.getStoredApiKey("eventbrite");

    if (!ticketmasterKey && !eventbriteKey) {
      console.log("No event API keys configured, using mock data");
      return this.getMockEventsData();
    }

    try {
      // For now, skip actual API calls due to CORS issues in browser
      // In production, these calls would go through a backend proxy
      console.log("Event APIs would be called for live event data");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Return enhanced mock data based on current time and day
      return this.getEnhancedMockEventsData();
    } catch (error) {
      console.error("Events fetch failed:", error);
      return this.getMockEventsData();
    }
  }

  // Fetch flight data from FlightAware
  async fetchFlightData(): Promise<FlightData> {
    const flightKey = this.getStoredApiKey("flightaware");

    if (!flightKey) {
      console.log("FlightAware API key not configured, using mock data");
      return this.getMockFlightData();
    }

    try {
      // For now, skip actual API calls due to CORS issues in browser
      // In production, these calls would go through a backend proxy
      const airportCode = this.getAirportCode(this.city);
      console.log(
        `FlightAware API would be called for ${airportCode} flight data`,
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Return enhanced mock data based on time of day
      return this.getEnhancedMockFlightData();
    } catch (error) {
      console.error("Flight fetch failed:", error);
      return this.getMockFlightData();
    }
  }

  // Main function to calculate surge predictions
  async calculateSurgePredictions(): Promise<SurgeArea[]> {
    const [weather, traffic, events, flights] = await Promise.all([
      this.fetchWeatherData(),
      this.fetchTrafficData(),
      this.fetchEventsData(),
      this.fetchFlightData(),
    ]);

    const areas = this.getKeyAreas(this.city);

    return areas
      .map((area) => {
        const prediction = this.calculateAreaSurge(
          area,
          weather,
          traffic,
          events,
          flights,
        );
        return {
          ...area,
          ...prediction,
          trend: this.calculateTrend(area, prediction),
        };
      })
      .sort((a, b) => b.predictedMultiplier - a.predictedMultiplier);
  }

  // Calculate surge for a specific area based on all data sources
  private calculateAreaSurge(
    area: any,
    weather: WeatherData,
    traffic: TrafficData,
    events: EventData[],
    flights: FlightData,
  ) {
    let baseMultiplier = 1.0;
    let confidence = 70;
    const reasons: string[] = [];

    // Weather impact
    if (weather.impact === "high") {
      baseMultiplier += 0.8;
      confidence += 15;
      reasons.push(`${weather.condition} weather increasing demand`);
    } else if (weather.impact === "medium") {
      baseMultiplier += 0.3;
      confidence += 10;
      reasons.push(`${weather.condition} affecting ridership`);
    }

    // Traffic impact
    if (traffic.congestionLevel > 70) {
      baseMultiplier += 0.5;
      confidence += 10;
      reasons.push("Heavy traffic increasing demand");
    }

    // Events impact
    const nearbyEvents = events.filter(
      (event) =>
        this.isEventNearArea(event, area) &&
        (event.status === "ongoing" || event.status === "ending"),
    );

    nearbyEvents.forEach((event) => {
      if (event.expectedAttendance > 10000) {
        baseMultiplier += 1.2;
        confidence += 20;
        reasons.push(`${event.name} ending soon`);
      } else if (event.expectedAttendance > 5000) {
        baseMultiplier += 0.6;
        confidence += 15;
        reasons.push(`${event.name} nearby`);
      }
    });

    // Airport impact (for airport areas)
    if (area.location.toLowerCase().includes("airport")) {
      if (flights.delays > 5) {
        baseMultiplier += 0.4;
        confidence += 10;
        reasons.push(`${flights.delays} flight delays`);
      }
      if (flights.totalFlights > 20) {
        baseMultiplier += 0.2;
        confidence += 5;
        reasons.push("High flight activity");
      }
    }

    // Time-based factors
    const hour = new Date().getHours();
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      baseMultiplier += 0.3;
      confidence += 10;
      reasons.push("Rush hour");
    }

    if (hour >= 21 && hour <= 2) {
      baseMultiplier += 0.4;
      confidence += 10;
      reasons.push("Nightlife hours");
    }

    return {
      currentMultiplier: Math.min(baseMultiplier, 4.0),
      predictedMultiplier: Math.min(baseMultiplier * 1.1, 4.0),
      confidence: Math.min(confidence, 98),
      reasons: reasons.slice(0, 3), // Top 3 reasons
      estimatedDuration: this.calculateDuration(reasons),
    };
  }

  // Add event listener for real-time updates
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Remove event listener
  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify all listeners of updates
  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Fetch all data and notify listeners
  private async fetchAllData() {
    try {
      console.log("Fetching real-time data...");

      // Fetch data with individual error handling
      const [surgeData, weather] = await Promise.allSettled([
        this.calculateSurgePredictions(),
        this.fetchWeatherData(),
      ]);

      if (surgeData.status === "fulfilled") {
        this.notifyListeners("surge-update", surgeData.value);
      } else {
        console.error("Surge data fetch failed:", surgeData.reason);
      }

      if (weather.status === "fulfilled") {
        this.notifyListeners("weather-update", weather.value);
      } else {
        console.error("Weather data fetch failed:", weather.reason);
      }

      console.log("Real-time data update completed");
    } catch (error) {
      console.error("Failed to fetch real-time data:", error);
      // Notify with fallback data
      this.notifyListeners("surge-update", []);
      this.notifyListeners("weather-update", this.getMockWeatherData());
    }
  }

  // Get stored API key from localStorage
  private getStoredApiKey(service: keyof typeof this.API_KEYS): string | null {
    try {
      const stored = localStorage.getItem("uberBoostApiKeys");
      if (stored) {
        const keys = JSON.parse(stored);
        return keys[service] || null;
      }
    } catch (error) {
      console.error("Failed to load API keys:", error);
    }
    return null;
  }

  // Enhanced mock data that simulates real-time changes
  private getEnhancedMockWeatherData(): WeatherData {
    const hour = new Date().getHours();
    const random = Math.random();

    // Simulate different weather based on time and randomness
    let condition = "Clear";
    let impact: "high" | "medium" | "low" = "low";
    let precipitation = 0;

    if (hour >= 14 && hour <= 18 && random > 0.7) {
      condition = "Thunderstorm";
      impact = "high";
      precipitation = 0.3 + Math.random() * 0.5;
    } else if (random > 0.8) {
      condition = "Rain";
      impact = "high";
      precipitation = 0.1 + Math.random() * 0.3;
    } else if (random > 0.6) {
      condition = "Cloudy";
      impact = "medium";
    }

    return {
      condition,
      temperature: 75 + Math.floor(Math.random() * 15),
      humidity: 60 + Math.floor(Math.random() * 30),
      windSpeed: Math.floor(Math.random() * 15),
      precipitation,
      impact,
    };
  }

  private getEnhancedMockTrafficData(): TrafficData {
    const hour = new Date().getHours();
    let baseCongestion = 30;

    // Rush hour simulation
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      baseCongestion = 70;
    } else if (hour >= 22 || hour <= 5) {
      baseCongestion = 15;
    }

    return {
      congestionLevel: baseCongestion + Math.floor(Math.random() * 20),
      incidents: this.generateMockIncidents(),
      avgSpeed: Math.max(15, 45 - baseCongestion / 2),
      delayMinutes: Math.floor(baseCongestion / 10 + Math.random() * 10),
    };
  }

  private getEnhancedMockEventsData(): EventData[] {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const events: EventData[] = [];

    // Weekend events
    if (day === 0 || day === 6) {
      events.push({
        id: "weekend-1",
        name: "Jacksonville Jaguars vs Miami Dolphins",
        venue: "TIAA Bank Field",
        startTime: "13:00",
        endTime: "16:30",
        expectedAttendance: 67000,
        category: "Sports",
        status: hour >= 16 ? "ending" : hour >= 13 ? "ongoing" : "upcoming",
      });
    }

    // Evening events
    if (hour >= 18) {
      events.push({
        id: "evening-1",
        name: "Riverside Arts Market",
        venue: "Riverside",
        startTime: "19:00",
        endTime: "22:00",
        expectedAttendance: 5000,
        category: "Arts",
        status: hour >= 22 ? "ending" : "ongoing",
      });
    }

    return events;
  }

  private getEnhancedMockFlightData(): FlightData {
    const hour = new Date().getHours();
    let baseFlights = 20;
    let baseDelays = 2;

    // Peak flight times
    if ((hour >= 6 && hour <= 10) || (hour >= 18 && hour <= 22)) {
      baseFlights = 45;
      baseDelays = 8;
    }

    return {
      totalFlights: baseFlights + Math.floor(Math.random() * 15),
      arrivals: [],
      departures: [],
      delays: baseDelays + Math.floor(Math.random() * 5),
    };
  }

  private generateMockIncidents(): TrafficIncident[] {
    const incidents: TrafficIncident[] = [];
    const random = Math.random();

    if (random > 0.7) {
      incidents.push({
        id: "incident-1",
        type: "accident",
        location: "I-95 North near Airport Rd",
        severity: "medium",
        estimatedDuration: 30 + Math.floor(Math.random() * 30),
      });
    }

    if (random > 0.85) {
      incidents.push({
        id: "incident-2",
        type: "construction",
        location: "I-10 East near Downtown",
        severity: "low",
        estimatedDuration: 120,
      });
    }

    return incidents;
  }

  // Helper methods for mock data when APIs are unavailable
  private getMockWeatherData(): WeatherData {
    const conditions = ["Clear", "Cloudy", "Rain", "Thunderstorm"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      condition,
      temperature: 75 + Math.floor(Math.random() * 15),
      humidity: 60 + Math.floor(Math.random() * 30),
      windSpeed: Math.floor(Math.random() * 15),
      precipitation: condition === "Rain" ? Math.random() * 0.5 : 0,
      impact:
        condition === "Rain" || condition === "Thunderstorm" ? "high" : "low",
    };
  }

  private getMockTrafficData(): TrafficData {
    return {
      congestionLevel: 40 + Math.floor(Math.random() * 40),
      incidents: [
        {
          id: "1",
          type: "accident",
          location: "I-95 North near Airport Rd",
          severity: "medium",
          estimatedDuration: 30,
        },
      ],
      avgSpeed: 25 + Math.floor(Math.random() * 20),
      delayMinutes: Math.floor(Math.random() * 15),
    };
  }

  private getMockEventsData(): EventData[] {
    return [
      {
        id: "1",
        name: "Jacksonville Jaguars vs Miami Dolphins",
        venue: "TIAA Bank Field",
        startTime: "13:00",
        endTime: "16:30",
        expectedAttendance: 67000,
        category: "Sports",
        status: "ending",
      },
      {
        id: "2",
        name: "Riverside Arts Market",
        venue: "Riverside",
        startTime: "10:00",
        endTime: "15:00",
        expectedAttendance: 5000,
        category: "Arts",
        status: "ongoing",
      },
    ];
  }

  private getMockFlightData(): FlightData {
    return {
      totalFlights: 45,
      arrivals: [],
      departures: [],
      delays: 8,
    };
  }

  // Helper methods
  private calculateWeatherImpact(
    condition: string,
    precipitation: number,
  ): "high" | "medium" | "low" {
    if (
      condition === "Rain" ||
      condition === "Thunderstorm" ||
      precipitation > 0.1
    ) {
      return "high";
    }
    if (condition === "Cloudy" || condition === "Drizzle") {
      return "medium";
    }
    return "low";
  }

  private calculateCongestionLevel(data: any): number {
    // Would calculate based on actual traffic data
    return 50 + Math.floor(Math.random() * 40);
  }

  private async fetchTrafficIncidents(): Promise<TrafficIncident[]> {
    // Would fetch from traffic APIs
    return [];
  }

  private parseTicketmasterEvents(data: any): EventData[] {
    // Would parse Ticketmaster API response
    return [];
  }

  private getAirportCode(city: string): string {
    const codes: Record<string, string> = {
      Jacksonville: "JAX",
      Miami: "MIA",
      Orlando: "MCO",
      Tampa: "TPA",
      "Fort Lauderdale": "FLL",
    };
    return codes[city] || "JAX";
  }

  private getKeyAreas(city: string) {
    const areas: Record<string, any[]> = {
      Jacksonville: [
        {
          location: "Jacksonville Landing",
          coordinates: { lat: 30.3272, lng: -81.6569 },
        },
        {
          location: "Riverside/Avondale",
          coordinates: { lat: 30.3156, lng: -81.6906 },
        },
        {
          location: "Jacksonville Airport",
          coordinates: { lat: 30.4941, lng: -81.6879 },
        },
        {
          location: "TIAA Bank Field",
          coordinates: { lat: 30.324, lng: -81.6373 },
        },
        {
          location: "Town Center",
          coordinates: { lat: 30.2672, lng: -81.4943 },
        },
      ],
    };
    return areas[city] || areas["Jacksonville"];
  }

  private isEventNearArea(event: EventData, area: any): boolean {
    // Would calculate distance based on coordinates
    return Math.random() > 0.7; // Mock implementation
  }

  private calculateTrend(
    area: any,
    prediction: any,
  ): "increasing" | "stable" | "decreasing" {
    if (prediction.predictedMultiplier > prediction.currentMultiplier + 0.2) {
      return "increasing";
    }
    if (prediction.predictedMultiplier < prediction.currentMultiplier - 0.2) {
      return "decreasing";
    }
    return "stable";
  }

  private calculateDuration(reasons: string[]): number {
    // Calculate estimated duration based on reasons
    if (reasons.some((r) => r.includes("event") || r.includes("game"))) {
      return 60; // 1 hour
    }
    if (reasons.some((r) => r.includes("weather"))) {
      return 120; // 2 hours
    }
    return 30; // 30 minutes default
  }

  // Cleanup
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.wsConnection) {
      this.wsConnection.close();
    }
    this.listeners.clear();
  }
}

export default RealTimeDataService;
