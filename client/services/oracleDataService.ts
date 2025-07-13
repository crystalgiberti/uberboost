// Oracle Data Service - Real-time intelligence for supernatural accuracy
export interface OracleDataPoint {
  timestamp: Date;
  confidence: number;
  source: string;
  impact: number;
  details: any;
}

export interface SurgePredictor {
  location: string;
  coordinates: [number, number];
  baseSurge: number;
  predictedSurge: number;
  factors: SurgeFactor[];
  confidence: number;
  timeframe: number; // minutes
}

export interface SurgeFactor {
  type: "weather" | "traffic" | "events" | "social" | "economic" | "mystical";
  impact: number; // 0-1 multiplier
  confidence: number;
  source: string;
  details: string;
}

class OracleDataService {
  private dataStreams: Map<string, OracleDataPoint[]> = new Map();
  private listeners: ((data: any) => void)[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeDataStreams();
    this.startRealTimeUpdates();
  }

  private initializeDataStreams() {
    // Initialize data stream tracking
    const streams = [
      "weather",
      "traffic",
      "events",
      "social",
      "flights",
      "stocks",
      "news",
      "mystical",
    ];

    streams.forEach((stream) => {
      this.dataStreams.set(stream, []);
    });
  }

  private startRealTimeUpdates() {
    // Update every 30 seconds for real-time feel
    this.updateInterval = setInterval(() => {
      this.gatherLiveIntelligence();
    }, 30000);

    // Initial data gather
    this.gatherLiveIntelligence();
  }

  private async gatherLiveIntelligence() {
    try {
      // Simulate gathering data from multiple real sources
      const updates = await Promise.allSettled([
        this.getWeatherIntelligence(),
        this.getTrafficIntelligence(),
        this.getEventIntelligence(),
        this.getSocialIntelligence(),
        this.getFlightIntelligence(),
        this.getEconomicIntelligence(),
        this.getMysticalIntelligence(),
      ]);

      // Process and store updates
      updates.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const streamName = [
            "weather",
            "traffic",
            "events",
            "social",
            "flights",
            "economic",
            "mystical",
          ][index];
          this.updateDataStream(streamName, result.value);
        }
      });

      // Notify listeners
      this.notifyListeners(this.generateSurgeIntelligence());
    } catch (error) {
      console.error("Oracle intelligence gathering failed:", error);
    }
  }

  private async getWeatherIntelligence(): Promise<OracleDataPoint> {
    // In production, integrate with weather APIs (OpenWeatherMap, WeatherAPI)
    const weatherConditions = ["clear", "cloudy", "rain", "storm", "fog"];
    const condition =
      weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    let impact = 0;
    let details = "";

    switch (condition) {
      case "rain":
        impact = 0.8;
        details =
          "Light rain detected. Surge building as people avoid walking.";
        break;
      case "storm":
        impact = 1.5;
        details =
          "Storm approaching! Massive surge incoming as public transport disrupted.";
        break;
      case "fog":
        impact = 0.4;
        details = "Dense fog reducing visibility. Airport delays likely.";
        break;
      default:
        impact = 0;
        details = "Clear weather. Normal demand patterns expected.";
    }

    return {
      timestamp: new Date(),
      confidence: 85 + Math.random() * 12,
      source: "WeatherNet AI",
      impact,
      details: {
        condition,
        description: details,
        temperature: 70 + Math.random() * 30,
        humidity: 40 + Math.random() * 50,
        windSpeed: Math.random() * 20,
      },
    };
  }

  private async getTrafficIntelligence(): Promise<OracleDataPoint> {
    // In production, integrate with Google Maps Traffic API, Waze API
    const hour = new Date().getHours();
    let impact = 0;
    let details = "";

    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      impact = 0.6 + Math.random() * 0.4; // Rush hour
      details =
        "Rush hour traffic congestion. High demand for rideshare alternatives.";
    } else if (Math.random() < 0.2) {
      impact = 1.2; // Random incident
      details =
        "Major traffic incident detected on I-95. Surge building in affected areas.";
    } else {
      impact = 0.1;
      details = "Normal traffic flow. Standard demand patterns.";
    }

    return {
      timestamp: new Date(),
      confidence: 90 + Math.random() * 8,
      source: "TrafficMind Pro",
      impact,
      details: {
        congestionLevel: impact,
        description: details,
        incidents: Math.floor(Math.random() * 5),
        avgSpeed: 25 + Math.random() * 30,
      },
    };
  }

  private async getEventIntelligence(): Promise<OracleDataPoint> {
    // In production, integrate with Eventbrite API, venue APIs, sports APIs
    const events = [
      { name: "Jaguars Game", impact: 2.5, venue: "TIAA Bank Field" },
      { name: "Concert Downtown", impact: 1.8, venue: "Daily's Place" },
      {
        name: "Convention Center Event",
        impact: 1.5,
        venue: "Prime F. Osborn III Convention Center",
      },
      { name: "University Graduation", impact: 1.3, venue: "UNF Arena" },
      { name: "Airport Conference", impact: 1.0, venue: "Airport District" },
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    const isActive = Math.random() < 0.3; // 30% chance of active event

    return {
      timestamp: new Date(),
      confidence: 82 + Math.random() * 15,
      source: "EventTracker Neural",
      impact: isActive ? event.impact : 0,
      details: {
        eventName: event.name,
        venue: event.venue,
        isActive,
        description: isActive
          ? `${event.name} is currently active at ${event.venue}. Surge expected nearby.`
          : "No major events detected in the next 2 hours.",
        attendees: isActive ? 5000 + Math.random() * 45000 : 0,
        endTime: isActive
          ? new Date(Date.now() + (1 + Math.random() * 3) * 3600000)
          : null,
      },
    };
  }

  private async getSocialIntelligence(): Promise<OracleDataPoint> {
    // In production, integrate with social media APIs (Twitter, Instagram, TikTok)
    const socialTrends = [
      { trend: "New restaurant opening", impact: 0.8, location: "Riverside" },
      { trend: "Instagram popup event", impact: 1.2, location: "Downtown" },
      { trend: "TikTok viral location", impact: 1.5, location: "Beaches" },
      {
        trend: "Twitter trending party",
        impact: 1.0,
        location: "Nightlife District",
      },
      { trend: "Influencer meetup", impact: 0.9, location: "Town Center" },
    ];

    const trend = socialTrends[Math.floor(Math.random() * socialTrends.length)];
    const isViral = Math.random() < 0.25; // 25% chance of viral trend

    return {
      timestamp: new Date(),
      confidence: 70 + Math.random() * 25,
      source: "SocialPulse AI",
      impact: isViral ? trend.impact : 0,
      details: {
        trend: trend.trend,
        location: trend.location,
        isViral,
        description: isViral
          ? `Viral social media trend detected: ${trend.trend} in ${trend.location}`
          : "No significant social media trends affecting rideshare demand.",
        mentions: isViral ? 1000 + Math.random() * 9000 : 0,
        sentiment: 0.3 + Math.random() * 0.7,
      },
    };
  }

  private async getFlightIntelligence(): Promise<OracleDataPoint> {
    // In production, integrate with flight APIs (FlightAware, AviationStack)
    const flightStatuses = ["on-time", "delayed", "cancelled", "diverted"];
    const status =
      flightStatuses[Math.floor(Math.random() * flightStatuses.length)];

    let impact = 0;
    let details = "";

    switch (status) {
      case "delayed":
        impact = 1.2;
        details = "Multiple flight delays detected. Airport surge building.";
        break;
      case "cancelled":
        impact = 2.0;
        details =
          "Flight cancellations reported. Massive airport surge expected.";
        break;
      case "diverted":
        impact = 1.5;
        details = "Weather diversions causing passenger backups.";
        break;
      default:
        impact = 0.2;
        details = "Normal flight operations. Standard airport demand.";
    }

    return {
      timestamp: new Date(),
      confidence: 88 + Math.random() * 10,
      source: "FlightMind Oracle",
      impact,
      details: {
        status,
        description: details,
        delayedFlights: status === "delayed" ? 5 + Math.random() * 20 : 0,
        cancelledFlights: status === "cancelled" ? 2 + Math.random() * 8 : 0,
        passengerBacklog: impact > 1 ? 500 + Math.random() * 2000 : 0,
      },
    };
  }

  private async getEconomicIntelligence(): Promise<OracleDataPoint> {
    // In production, integrate with stock APIs, economic indicators
    const hour = new Date().getHours();
    let impact = 0;
    let details = "";

    if (hour >= 9 && hour <= 16) {
      // Business hours - check "market mood"
      const marketMood = Math.random();
      if (marketMood > 0.7) {
        impact = 0.5;
        details =
          "Positive market sentiment. Business district activity elevated.";
      } else if (marketMood < 0.3) {
        impact = -0.2;
        details = "Market uncertainty. Reduced business travel detected.";
      } else {
        impact = 0;
        details = "Neutral market conditions. Standard business patterns.";
      }
    }

    return {
      timestamp: new Date(),
      confidence: 75 + Math.random() * 20,
      source: "EconPulse AI",
      impact,
      details: {
        marketSentiment: 0.3 + Math.random() * 0.7,
        description: details,
        businessActivity:
          hour >= 9 && hour <= 16 ? 0.6 + Math.random() * 0.4 : 0.1,
        conferenceLevel: Math.random() * 0.8,
      },
    };
  }

  private async getMysticalIntelligence(): Promise<OracleDataPoint> {
    // "AI-powered" mystical factors that make predictions feel supernatural
    const now = new Date();
    const moonPhase = (now.getDate() % 28) / 28;
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    let impact = 0;
    let details = "";

    // "Divine patterns"
    const mysticalNumbers = [3, 7, 11, 13, 17, 19, 23];
    const isLuckyHour = mysticalNumbers.includes(hour);
    const isFullMoon = moonPhase > 0.85;
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    if (isFullMoon) {
      impact += 0.4;
      details += "Full moon energy amplifying demand patterns. ";
    }

    if (isLuckyHour) {
      impact += 0.3;
      details += `Sacred hour ${hour} detected - mystical surge alignment. `;
    }

    if (isWeekend) {
      impact += 0.5;
      details += "Weekend energy matrix activated. ";
    }

    // Add random "quantum fluctuations"
    const quantumBoost = (Math.random() - 0.5) * 0.6;
    impact += quantumBoost;

    if (Math.abs(quantumBoost) > 0.2) {
      details += `Quantum surge fluctuation detected: ${quantumBoost > 0 ? "positive" : "negative"} energy field. `;
    }

    if (!details) {
      details = "Mystical energies in balance. Normal patterns maintained.";
    }

    return {
      timestamp: new Date(),
      confidence: 60 + Math.random() * 35, // Lower confidence adds to mystique
      source: "Divine Oracle Matrix",
      impact: Math.max(-0.5, Math.min(1.5, impact)), // Cap the impact
      details: {
        moonPhase: moonPhase,
        description: details.trim(),
        cosmicAlignment: 0.2 + Math.random() * 0.8,
        divineFavor:
          isLuckyHour && isFullMoon
            ? "MAXIMUM"
            : isLuckyHour || isFullMoon
              ? "HIGH"
              : isWeekend
                ? "ELEVATED"
                : "NORMAL",
        quantumState: quantumBoost,
      },
    };
  }

  private updateDataStream(streamName: string, dataPoint: OracleDataPoint) {
    const stream = this.dataStreams.get(streamName) || [];
    stream.push(dataPoint);

    // Keep only last 10 data points per stream
    if (stream.length > 10) {
      stream.shift();
    }

    this.dataStreams.set(streamName, stream);
  }

  private generateSurgeIntelligence() {
    const allData: OracleDataPoint[] = [];
    this.dataStreams.forEach((stream) => {
      allData.push(...stream.slice(-1)); // Get latest from each stream
    });

    // Calculate composite surge multiplier
    const totalImpact = allData.reduce((sum, point) => {
      return sum + point.impact * (point.confidence / 100);
    }, 0);

    const averageConfidence =
      allData.reduce((sum, point) => sum + point.confidence, 0) /
      allData.length;

    return {
      timestamp: new Date(),
      surgeMultiplier: Math.max(1.0, 1.0 + totalImpact),
      confidence: Math.round(averageConfidence),
      sources: allData.length,
      factors: allData.map((point) => ({
        source: point.source,
        impact: point.impact,
        confidence: point.confidence,
        details: point.details.description || "Data processed",
      })),
      recommendation: this.generateRecommendation(1.0 + totalImpact),
      mysticalPower:
        allData.find((p) => p.source === "Divine Oracle Matrix")?.impact || 0,
    };
  }

  private generateRecommendation(surge: number): string {
    if (surge >= 3.0) return "DIVINE - The Oracle commands you to drive NOW!";
    if (surge >= 2.5)
      return "RUSH - Massive surge incoming! Position immediately!";
    if (surge >= 2.0) return "GO - High probability surge. Move to position.";
    if (surge >= 1.5) return "WAIT - Elevated demand building. Stay alert.";
    return "AVOID - Low demand period. Rest or reposition.";
  }

  private notifyListeners(intelligence: any) {
    this.listeners.forEach((listener) => {
      try {
        listener(intelligence);
      } catch (error) {
        console.error("Oracle listener error:", error);
      }
    });
  }

  // Public API
  public subscribe(callback: (data: any) => void) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public getLatestIntelligence() {
    return this.generateSurgeIntelligence();
  }

  public getDataStream(streamName: string): OracleDataPoint[] {
    return this.dataStreams.get(streamName) || [];
  }

  public getAllStreams(): Map<string, OracleDataPoint[]> {
    return new Map(this.dataStreams);
  }

  public destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.listeners = [];
    this.dataStreams.clear();
  }

  // Special Oracle methods for maximum psychological impact
  public getOracleReadingForLocation(lat: number, lng: number) {
    const intelligence = this.generateSurgeIntelligence();

    // Add location-specific "mystical" adjustments
    const locationHash = Math.abs((lat + lng) * 1000) % 100;
    const locationBoost = (locationHash / 100 - 0.5) * 0.8;

    return {
      ...intelligence,
      locationPower: locationBoost,
      locationReading: this.generateLocationReading(
        lat,
        lng,
        intelligence.surgeMultiplier + locationBoost,
      ),
      sacredGeometry: this.calculateSacredGeometry(lat, lng),
    };
  }

  private generateLocationReading(
    lat: number,
    lng: number,
    surge: number,
  ): string {
    const readings = [
      `The spirits of this location whisper of ${surge > 2 ? "immense" : "moderate"} prosperity...`,
      `Ancient energy lines converge here, amplifying your earning potential by ${Math.round(surge * 100)}%...`,
      `The Oracle sees ${surge > 2.5 ? "golden" : "silver"} threads of opportunity weaving through this area...`,
      `Divine coordinates aligned: Maximum driver blessing ${surge > 3 ? "ACTIVATED" : "building"}...`,
      `The universe conspires to deliver ${surge > 2 ? "abundant" : "steady"} rides to this sacred ground...`,
    ];

    return readings[Math.floor(Math.random() * readings.length)];
  }

  private calculateSacredGeometry(lat: number, lng: number): number {
    // Mystical mathematical calculation that always produces an impressive result
    const phi = 1.618033988749; // Golden ratio
    const factor = (Math.abs(lat) + Math.abs(lng)) * phi;
    return Math.round((factor % 1) * 100) / 100;
  }
}

// Singleton instance
export const oracleDataService = new OracleDataService();

// Convenience functions
export const subscribeToOracle = (callback: (data: any) => void) => {
  return oracleDataService.subscribe(callback);
};

export const getOracleIntelligence = () => {
  return oracleDataService.getLatestIntelligence();
};

export const getLocationReading = (lat: number, lng: number) => {
  return oracleDataService.getOracleReadingForLocation(lat, lng);
};
