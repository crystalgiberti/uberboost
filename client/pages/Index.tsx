import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RealTimeDataService from "../services/realTimeDataService";
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  Zap,
  Eye,
  Navigation,
  Fuel,
  Bell,
  Settings,
  User,
  BarChart3,
  Calendar,
  Cloud,
  Car,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SurgeData {
  location: string;
  multiplier: number;
  estimatedTime: string;
  reason: string;
  confidence: number;
}

interface WeatherData {
  condition: string;
  temperature: number;
  impact: "high" | "medium" | "low";
}

export default function Index() {
  const navigate = useNavigate();
  const [currentEarnings, setCurrentEarnings] = useState(87.5);
  const [dailyGoal] = useState(150);
  const [isOnline, setIsOnline] = useState(false);
  const [currentCity, setCurrentCity] = useState("Jacksonville");
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const floridaCities = [
    "Jacksonville",
    "Miami",
    "Tampa",
    "Orlando",
    "St. Petersburg",
    "Hialeah",
    "Fort Lauderdale",
    "Gainesville",
    "West Palm Beach",
  ];

  const getSurgeAreasForCity = (city: string): SurgeData[] => {
    const areas: Record<string, SurgeData[]> = {
      Jacksonville: [
        {
          location: "Jacksonville Landing",
          multiplier: 2.8,
          estimatedTime: "8 min",
          reason: "Jaguars game ending",
          confidence: 94,
        },
        {
          location: "Riverside/Avondale",
          multiplier: 2.3,
          estimatedTime: "15 min",
          reason: "Nightlife district",
          confidence: 87,
        },
        {
          location: "Downtown Jacksonville",
          multiplier: 1.8,
          estimatedTime: "12 min",
          reason: "Rush hour traffic",
          confidence: 78,
        },
      ],
      Miami: [
        {
          location: "Miami Beach Art Deco",
          multiplier: 2.8,
          estimatedTime: "8 min",
          reason: "Beach event ending",
          confidence: 94,
        },
        {
          location: "Wynwood Arts District",
          multiplier: 2.3,
          estimatedTime: "15 min",
          reason: "Gallery openings",
          confidence: 87,
        },
        {
          location: "Brickell Financial",
          multiplier: 1.8,
          estimatedTime: "12 min",
          reason: "Rush hour traffic",
          confidence: 78,
        },
      ],
      Tampa: [
        {
          location: "Ybor City",
          multiplier: 2.5,
          estimatedTime: "10 min",
          reason: "Live music venues",
          confidence: 89,
        },
        {
          location: "Downtown Tampa",
          multiplier: 2.1,
          estimatedTime: "8 min",
          reason: "Business district rush",
          confidence: 82,
        },
        {
          location: "Hyde Park",
          multiplier: 1.9,
          estimatedTime: "14 min",
          reason: "Restaurant district",
          confidence: 76,
        },
      ],
      Orlando: [
        {
          location: "Universal Studios",
          multiplier: 3.2,
          estimatedTime: "5 min",
          reason: "Park closing surge",
          confidence: 96,
        },
        {
          location: "Disney World Area",
          multiplier: 2.9,
          estimatedTime: "12 min",
          reason: "Evening fireworks",
          confidence: 93,
        },
        {
          location: "International Drive",
          multiplier: 2.2,
          estimatedTime: "18 min",
          reason: "Tourist traffic",
          confidence: 85,
        },
      ],
    };

    return areas[city] || areas.Jacksonville;
  };

  // Initialize real-time data service
  useEffect(() => {
    const dataService = new RealTimeDataService(currentCity);

    // Listen for surge updates
    dataService.on("surge-update", (surgeData: any) => {
      setRealTimeData((prev: any) => ({
        ...prev,
        surgeAreas: surgeData,
      }));
      setLastUpdate(new Date());
      setIsLoading(false);
    });

    // Listen for weather updates
    dataService.on("weather-update", (weatherData: any) => {
      setRealTimeData((prev: any) => ({
        ...prev,
        weather: weatherData,
      }));
    });

    // Cleanup on unmount
    return () => {
      dataService.destroy();
    };
  }, [currentCity]);

  // Get surge areas - use real-time data if available, fallback to mock
  const surgeAreas =
    realTimeData?.surgeAreas || getSurgeAreasForCity(currentCity);

  // Get weather data - use real-time data if available, fallback to mock
  const weather: WeatherData = realTimeData?.weather || {
    condition: "Light Rain",
    temperature: 82,
    impact: "high",
  };

  const getSurgeColor = (multiplier: number) => {
    if (multiplier >= 2.5) return "bg-surge-very-high";
    if (multiplier >= 2.0) return "bg-surge-high";
    if (multiplier >= 1.5) return "bg-surge-medium";
    return "bg-surge-low";
  };

  const getProgressPercentage = () => {
    return Math.min((currentEarnings / dailyGoal) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-florida-ocean/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-florida-ocean to-florida-ocean-dark rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Uber Boost</h1>
              <p className="text-xs text-muted-foreground">by Eliv8</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Status & Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setIsOnline(!isOnline)}
            className={`h-16 text-lg font-semibold ${
              isOnline
                ? "bg-surge-low hover:bg-surge-low/90 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full mb-1 ${isOnline ? "bg-white" : "bg-gray-500"}`}
              />
              {isOnline ? "Online" : "Go Online"}
            </div>
          </Button>
          <Card className="border-florida-ocean/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-2">Location</div>
              <Select value={currentCity} onValueChange={setCurrentCity}>
                <SelectTrigger className="border-florida-ocean/30 focus:border-florida-ocean">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-florida-ocean" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {floridaCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Progress */}
        <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-sky/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">Today's Earnings</span>
              <DollarSign className="w-5 h-5 text-florida-ocean" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-florida-ocean-dark">
                  ${currentEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Goal: ${dailyGoal}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-florida-ocean to-florida-ocean-dark h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                ${(dailyGoal - currentEarnings).toFixed(2)} to reach daily goal
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Impact */}
        <Card className="border-florida-coral/20 bg-gradient-to-r from-white to-florida-coral/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">Weather Boost</span>
              <Cloud className="w-5 h-5 text-florida-coral" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-florida-coral">
                  {weather.condition}
                </div>
                <div className="text-sm text-muted-foreground">
                  {weather.temperature}°F
                </div>
              </div>
              <Badge
                variant={weather.impact === "high" ? "default" : "secondary"}
                className="bg-florida-coral text-white"
              >
                +25% demand expected
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Fortune Teller - Surge Predictions */}
        <Card className="border-florida-sunset/20 bg-gradient-to-r from-white to-florida-sunset-light/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">🔮 Live Surge Fortune Teller</span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-500" : "bg-green-500"} ${!isLoading ? "animate-pulse" : ""}`}
                />
                <Eye className="w-5 h-5 text-florida-sunset" />
              </div>
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading real-time data..."
                : `Last updated: ${lastUpdate.toLocaleTimeString()}`}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {surgeAreas.slice(0, 3).map((area: any, index: number) => {
              const multiplier =
                area.predictedMultiplier || area.multiplier || 1.0;
              const confidence = area.confidence || 75;
              const reasons = area.reasons || [
                area.reason || "Real-time analysis",
              ];
              const trend = area.trend || "stable";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-florida-sunset/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-sm">
                        {area.location}
                      </div>
                      {realTimeData && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-green-600">LIVE</span>
                        </div>
                      )}
                      {trend === "increasing" && (
                        <span className="text-xs">📈</span>
                      )}
                      {trend === "decreasing" && (
                        <span className="text-xs">📉</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {reasons[0]}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={`${getSurgeColor(multiplier)} text-white text-xs`}
                      >
                        {multiplier.toFixed(1)}x
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {area.estimatedTime ||
                          `${area.estimatedDuration || 30}min`}
                      </span>
                      {area.currentMultiplier &&
                        area.predictedMultiplier &&
                        area.currentMultiplier !== area.predictedMultiplier && (
                          <span className="text-xs text-blue-600">
                            {area.currentMultiplier.toFixed(1)}x →{" "}
                            {area.predictedMultiplier.toFixed(1)}x
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Confidence
                    </div>
                    <div className="font-bold text-florida-sunset">
                      {confidence}%
                    </div>
                    {realTimeData && (
                      <div className="text-xs text-green-600 mt-1">
                        Real-time
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-florida-palm/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-florida-palm mx-auto mb-2" />
              <div className="text-2xl font-bold text-florida-palm">12</div>
              <div className="text-xs text-muted-foreground">Rides Today</div>
            </CardContent>
          </Card>
          <Card className="border-florida-ocean/20">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-florida-ocean mx-auto mb-2" />
              <div className="text-2xl font-bold text-florida-ocean">4.9</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="h-12 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
            onClick={() => navigate("/surge-navigation")}
          >
            <Navigation className="w-5 h-5 mr-2" />
            Navigate to Surge
          </Button>
          <Button
            variant="outline"
            className="h-12 border-florida-palm text-florida-palm hover:bg-florida-palm hover:text-white"
            onClick={() => navigate("/gas-stations")}
          >
            <Fuel className="w-5 h-5 mr-2" />
            Find Cheap Gas
          </Button>
        </div>

        {/* Quick Ride Log */}
        <Card className="border-florida-coral/20 bg-gradient-to-r from-white to-florida-coral/10">
          <CardContent className="p-4">
            <Button
              className="w-full h-12 bg-florida-coral hover:bg-florida-coral/90 text-white"
              onClick={() => navigate("/ride-logger")}
            >
              <Car className="w-5 h-5 mr-2" />
              Log Ride
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Quick voice entry or detailed ride logging
            </p>
          </CardContent>
        </Card>

        {/* Bottom Navigation Placeholder */}
        <div className="h-20" />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-florida-ocean/20">
        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            className="flex-col h-auto py-2 text-florida-ocean"
            onClick={() => navigate("/")}
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs mt-1">Boost</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col h-auto py-2"
            onClick={() => navigate("/analytics")}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Analytics</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col h-auto py-2"
            onClick={() => navigate("/schedule")}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">Schedule</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col h-auto py-2"
            onClick={() => navigate("/expenses")}
          >
            <Car className="w-5 h-5" />
            <span className="text-xs mt-1">Expenses</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
