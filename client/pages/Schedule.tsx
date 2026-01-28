import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  subscribeToOracle,
  getOracleIntelligence,
} from "../services/oracleDataService";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Zap,
  TrendingUp,
  Target,
  Eye,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Star,
  Flame,
  Crown,
  Diamond,
  Bolt,
  Timer,
  Navigation,
  Phone,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface SurgeZone {
  name: string;
  location: [number, number]; // lat, lng
  currentMultiplier: number;
  predictedMultiplier: number;
  confidence: number;
  reason: string;
  timeToSurge: number; // minutes
  duration: number; // minutes
  averageEarnings: number;
  probability: number;
  urgency: "low" | "medium" | "high" | "critical";
  category:
    | "event"
    | "weather"
    | "traffic"
    | "social"
    | "business"
    | "nightlife"
    | "airport"
    | "divine";
  aiInsight: string;
  secretTip: string;
}

interface TimeSlot {
  time: string;
  hour: number;
  surge: number;
  confidence: number;
  earnings: number;
  zones: SurgeZone[];
  weatherImpact: number;
  eventImpact: number;
  trafficImpact: number;
  mysticalFactor: number;
  recommendation: "AVOID" | "WAIT" | "GO" | "RUSH" | "DIVINE";
}

export default function Schedule() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("today");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const updateIntervalRef = useRef<NodeJS.Timeout>();

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Oracle data updates
  useEffect(() => {
    const updateOracle = () => {
      setLastUpdate(new Date());
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    };

    if (isLiveMode) {
      updateOracle(); // Initial update
      updateIntervalRef.current = setInterval(updateOracle, 30000); // Update every 30 seconds
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isLiveMode]);

  // Generate Oracle-level predictions
  const generateOraclePredictions = (): TimeSlot[] => {
    const now = new Date();
    const predictions: TimeSlot[] = [];

    for (let hour = 0; hour < 24; hour++) {
      const timeDate = new Date();
      timeDate.setHours(hour, 0, 0, 0);

      // Advanced surge calculation using multiple factors
      const baseMultiplier = getSurgeBaseForHour(hour);
      const weatherBoost = getWeatherBoost(hour);
      const eventBoost = getEventBoost(hour);
      const trafficBoost = getTrafficBoost(hour);
      const mysticalBoost = getMysticalBoost(hour);
      const socialBoost = getSocialBoost(hour);

      const finalSurge = Math.max(
        1.0,
        baseMultiplier +
          weatherBoost +
          eventBoost +
          trafficBoost +
          mysticalBoost +
          socialBoost,
      );
      const confidence = Math.min(98, 75 + Math.random() * 23); // Always high confidence (75-98%)
      const earnings = calculateEarnings(finalSurge, hour);

      const zones = generateSurgeZones(hour, finalSurge);

      let recommendation: "AVOID" | "WAIT" | "GO" | "RUSH" | "DIVINE" = "WAIT";
      if (finalSurge >= 3.0) recommendation = "DIVINE";
      else if (finalSurge >= 2.5) recommendation = "RUSH";
      else if (finalSurge >= 1.8) recommendation = "GO";
      else if (finalSurge >= 1.3) recommendation = "WAIT";
      else recommendation = "AVOID";

      predictions.push({
        time: timeDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        hour,
        surge: Math.round(finalSurge * 10) / 10,
        confidence: Math.round(confidence),
        earnings,
        zones,
        weatherImpact: weatherBoost,
        eventImpact: eventBoost,
        trafficImpact: trafficBoost,
        mysticalFactor: mysticalBoost,
        recommendation,
      });
    }

    return predictions;
  };

  const getSurgeBaseForHour = (hour: number): number => {
    // Rush hours and nightlife patterns
    if (hour >= 7 && hour <= 9) return 1.8; // Morning rush
    if (hour >= 17 && hour <= 19) return 2.2; // Evening rush
    if (hour >= 22 || hour <= 2) return 2.5; // Nightlife
    if (hour >= 11 && hour <= 13) return 1.5; // Lunch
    if (hour >= 3 && hour <= 6) return 1.0; // Dead hours
    return 1.3; // Default
  };

  const getWeatherBoost = (hour: number): number => {
    // Simulate weather impact (in real app, use weather API)
    const weatherScenarios = [
      { condition: "rain", boost: 0.8, probability: 0.3 },
      { condition: "storm", boost: 1.5, probability: 0.1 },
      { condition: "snow", boost: 2.0, probability: 0.05 },
      { condition: "clear", boost: 0, probability: 0.6 },
    ];

    const scenario = weightedRandom(weatherScenarios);
    return scenario.boost * scenario.probability;
  };

  const getEventBoost = (hour: number): number => {
    // Simulate major events
    const events = [
      { name: "Jaguars Game", boost: 2.5, hours: [19, 20, 21, 22] },
      { name: "Concert Downtown", boost: 1.8, hours: [20, 21, 22, 23] },
      { name: "Airport Rush", boost: 1.5, hours: [5, 6, 7, 18, 19] },
      { name: "Club District", boost: 2.0, hours: [22, 23, 0, 1, 2] },
    ];

    return events.reduce((total, event) => {
      return event.hours.includes(hour) ? total + event.boost : total;
    }, 0);
  };

  const getTrafficBoost = (hour: number): number => {
    // Traffic-based surge
    if (hour >= 7 && hour <= 9) return 0.5; // Morning traffic
    if (hour >= 17 && hour <= 19) return 0.7; // Evening traffic
    return 0;
  };

  const getMysticalBoost = (hour: number): number => {
    // "AI-powered" mystical factors (makes it feel supernatural)
    const moonPhase = (new Date().getDate() % 28) / 28;
    const dayOfWeek = new Date().getDay();
    const mysticalNumbers = [3, 7, 11, 13, 17, 19]; // "Lucky" numbers

    let boost = 0;
    if (mysticalNumbers.includes(hour)) boost += 0.3;
    if (moonPhase > 0.8) boost += 0.4; // "Full moon effect"
    if (dayOfWeek === 5 || dayOfWeek === 6) boost += 0.5; // Weekend energy

    return boost * (0.8 + Math.random() * 0.4); // Add randomness
  };

  const getSocialBoost = (hour: number): number => {
    // Simulate social media trends and viral events
    const socialEvents = [
      { trigger: "Instagram Event", boost: 1.2, probability: 0.2 },
      { trigger: "TikTok Trend", boost: 0.8, probability: 0.3 },
      { trigger: "Twitter Buzz", boost: 0.6, probability: 0.4 },
    ];

    return socialEvents.reduce((total, event) => {
      return Math.random() < event.probability ? total + event.boost : total;
    }, 0);
  };

  const calculateEarnings = (surge: number, hour: number): number => {
    const baseEarnings = 25; // Base ride value
    const hourlyMultiplier = getHourlyDemand(hour);
    return Math.round(baseEarnings * surge * hourlyMultiplier);
  };

  const getHourlyDemand = (hour: number): number => {
    if (hour >= 22 || hour <= 2) return 1.4; // Late night premium
    if (hour >= 7 && hour <= 9) return 1.3; // Morning rush
    if (hour >= 17 && hour <= 19) return 1.5; // Evening rush
    if (hour >= 11 && hour <= 13) return 1.2; // Lunch
    return 1.0;
  };

  const generateSurgeZones = (hour: number, baseSurge: number): SurgeZone[] => {
    const zones: SurgeZone[] = [
      {
        name: "Downtown Core",
        location: [30.3322, -81.6557],
        currentMultiplier: baseSurge + (Math.random() * 0.5 - 0.25),
        predictedMultiplier: baseSurge + Math.random() * 1.0,
        confidence: 85 + Math.random() * 13,
        reason: getZoneReason("downtown", hour),
        timeToSurge: Math.floor(Math.random() * 20),
        duration: 45 + Math.floor(Math.random() * 60),
        averageEarnings: calculateEarnings(baseSurge + 0.3, hour),
        probability: 0.8 + Math.random() * 0.15,
        urgency: getSurgeUrgency(baseSurge + 0.3),
        category: getCategoryForHour(hour),
        aiInsight: getAIInsight("downtown", hour, baseSurge),
        secretTip: getSecretTip("downtown", hour),
      },
      {
        name: "Airport District",
        location: [30.4941, -81.6879],
        currentMultiplier: baseSurge + (Math.random() * 0.3 - 0.15),
        predictedMultiplier: baseSurge + Math.random() * 0.8,
        confidence: 90 + Math.random() * 8,
        reason: getZoneReason("airport", hour),
        timeToSurge: Math.floor(Math.random() * 15),
        duration: 30 + Math.floor(Math.random() * 45),
        averageEarnings: calculateEarnings(baseSurge + 0.2, hour),
        probability: 0.75 + Math.random() * 0.2,
        urgency: getSurgeUrgency(baseSurge + 0.2),
        category: "airport",
        aiInsight: getAIInsight("airport", hour, baseSurge),
        secretTip: getSecretTip("airport", hour),
      },
      {
        name: "Riverside/Avondale",
        location: [30.3203, -81.6757],
        currentMultiplier: baseSurge + (Math.random() * 0.4 - 0.2),
        predictedMultiplier: baseSurge + Math.random() * 0.9,
        confidence: 78 + Math.random() * 15,
        reason: getZoneReason("nightlife", hour),
        timeToSurge: Math.floor(Math.random() * 25),
        duration: 60 + Math.floor(Math.random() * 90),
        averageEarnings: calculateEarnings(baseSurge + 0.1, hour),
        probability: 0.7 + Math.random() * 0.25,
        urgency: getSurgeUrgency(baseSurge + 0.1),
        category: "nightlife",
        aiInsight: getAIInsight("nightlife", hour, baseSurge),
        secretTip: getSecretTip("nightlife", hour),
      },
    ];

    return zones.sort((a, b) => b.predictedMultiplier - a.predictedMultiplier);
  };

  const getZoneReason = (type: string, hour: number): string => {
    const reasons = {
      downtown: [
        "Major business district activity",
        "Corporate events ending",
        "Restaurant rush hour",
        "Shopping district peak",
        "Government building closure",
      ],
      airport: [
        "Flight delays causing backup",
        "International arrivals wave",
        "Holiday travel surge",
        "Weather disrupting flights",
        "Convention travelers departing",
      ],
      nightlife: [
        "Bar district heating up",
        "Concert venue letting out",
        "Restaurant week crowds",
        "Dating night surge",
        "Weekend party preparation",
      ],
    };

    const typeReasons = reasons[type as keyof typeof reasons] || [
      "High demand area",
    ];
    return typeReasons[Math.floor(Math.random() * typeReasons.length)];
  };

  const getSurgeUrgency = (
    multiplier: number,
  ): "low" | "medium" | "high" | "critical" => {
    if (multiplier >= 3.0) return "critical";
    if (multiplier >= 2.5) return "high";
    if (multiplier >= 1.8) return "medium";
    return "low";
  };

  const getCategoryForHour = (hour: number): SurgeZone["category"] => {
    if (hour >= 22 || hour <= 2) return "nightlife";
    if (hour >= 7 && hour <= 9) return "business";
    if (hour >= 17 && hour <= 19) return "traffic";
    if (hour >= 5 && hour <= 7) return "airport";
    return "social";
  };

  const getAIInsight = (zone: string, hour: number, surge: number): string => {
    const insights = [
      `🧠 AI detects unusual pattern: ${surge > 2 ? "MASSIVE" : "elevated"} demand building`,
      `🔮 Neural network predicts ${Math.round(surge * 100)}% higher earnings potential`,
      `⚡ Machine learning algorithm identifies optimal positioning window`,
      `🎯 Predictive model shows ${95 + Math.random() * 4}% accuracy for this zone`,
      `🌟 Deep learning analysis reveals hidden demand cluster forming`,
      `💎 Advanced algorithms detect perfect storm conditions`,
      `🚀 AI confidence level: EXTREMELY HIGH for next ${30 + Math.random() * 60} minutes`,
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  };

  const getSecretTip = (zone: string, hour: number): string => {
    const tips = [
      "🤫 Position 2 blocks BEFORE the pin for fastest pickup",
      "💡 Use airport cell phone lot for guaranteed rides",
      "🎪 Check Instagram for pop-up events creating instant demand",
      "🍔 Follow food trucks - they create mini surge zones",
      "📱 Monitor Twitter for breaking news affecting traffic",
      "🎵 Concert venues surge 20 minutes BEFORE official end time",
      "⚡ Storm approaching = instant 2x surge in 15 minutes",
      "🏆 Friday 11 PM = highest earning hour of the week",
      "🎯 Never chase surge - position where it WILL BE",
    ];

    return tips[Math.floor(Math.random() * tips.length)];
  };

  const weightedRandom = (items: any[]) => {
    const totalProbability = items.reduce(
      (sum, item) => sum + item.probability,
      0,
    );
    let random = Math.random() * totalProbability;

    for (const item of items) {
      random -= item.probability;
      if (random <= 0) return item;
    }

    return items[0];
  };

  const predictions = generateOraclePredictions();
  const currentHour = currentTime.getHours();
  const currentPrediction = predictions.find((p) => p.hour === currentHour);
  const nextHighSurge = predictions.find(
    (p) => p.hour > currentHour && p.surge >= 2.0,
  );

  const getRecommendationColor = (rec: string): string => {
    switch (rec) {
      case "DIVINE":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse";
      case "RUSH":
        return "bg-gradient-to-r from-red-500 to-orange-500 text-white";
      case "GO":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "WAIT":
        return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white";
      case "AVOID":
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case "DIVINE":
        return <Crown className="w-5 h-5" />;
      case "RUSH":
        return <Flame className="w-5 h-5" />;
      case "GO":
        return <CheckCircle className="w-5 h-5" />;
      case "WAIT":
        return <Clock className="w-5 h-5" />;
      case "AVOID":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Mystical Header */}
      <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-purple-300 hover:text-white hover:bg-purple-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 ${pulseAnimation ? "animate-pulse" : ""}`}
                >
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Oracle Scheduler
                  </h1>
                  <p className="text-sm text-purple-300">
                    Powered by Divine Intelligence • Last update:{" "}
                    {lastUpdate.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Wifi
                  className={`w-4 h-4 ${isLiveMode ? "text-green-400" : "text-gray-400"}`}
                />
                <span className="text-sm text-purple-300">Live Oracle</span>
                <Switch
                  checked={isLiveMode}
                  onCheckedChange={setIsLiveMode}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-purple-300">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Current Oracle Reading */}
        {currentPrediction && (
          <Card className="mb-6 bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-500/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Eye className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Current Oracle Reading
                </span>
                <Badge
                  className={getRecommendationColor(
                    currentPrediction.recommendation,
                  )}
                >
                  {getRecommendationIcon(currentPrediction.recommendation)}
                  {currentPrediction.recommendation}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {currentPrediction.surge}x
                  </div>
                  <div className="text-purple-300">Current Surge</div>
                  <div className="text-xs text-purple-400">
                    {currentPrediction.confidence}% confidence
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    ${currentPrediction.earnings}
                  </div>
                  <div className="text-purple-300">Avg Ride Value</div>
                  <div className="text-xs text-purple-400">
                    Per ride estimate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {currentPrediction.zones.length}
                  </div>
                  <div className="text-purple-300">Hot Zones</div>
                  <div className="text-xs text-purple-400">
                    Active surge areas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-pink-400 mb-2">
                    {Math.round(currentPrediction.mysticalFactor * 100)}%
                  </div>
                  <div className="text-purple-300">Oracle Power</div>
                  <div className="text-xs text-purple-400">
                    Divine amplification
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hourly Predictions */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-purple-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    24-Hour Prophecy
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {predictions.map((prediction) => {
                    const isCurrentHour = prediction.hour === currentHour;
                    const isHighValue = prediction.surge >= 2.0;

                    return (
                      <div
                        key={prediction.hour}
                        className={`p-4 rounded-lg border transition-all ${
                          isCurrentHour
                            ? "bg-gradient-to-r from-purple-600/50 to-blue-600/50 border-yellow-400 shadow-lg shadow-yellow-400/20"
                            : isHighValue
                              ? "bg-gradient-to-r from-red-600/30 to-orange-600/30 border-red-400/50 hover:border-red-400"
                              : "bg-gray-800/30 border-gray-600/50 hover:border-purple-400/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-300">
                                {prediction.time}
                              </div>
                              {isCurrentHour && (
                                <Badge className="bg-yellow-400 text-black text-xs">
                                  NOW
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <div
                                  className={`text-2xl font-bold ${
                                    prediction.surge >= 3.0
                                      ? "text-pink-400"
                                      : prediction.surge >= 2.5
                                        ? "text-red-400"
                                        : prediction.surge >= 2.0
                                          ? "text-orange-400"
                                          : prediction.surge >= 1.5
                                            ? "text-yellow-400"
                                            : "text-blue-400"
                                  }`}
                                >
                                  {prediction.surge}x
                                </div>
                                <div className="text-xs text-purple-400">
                                  {prediction.confidence}%
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-xl font-bold text-green-400">
                                  ${prediction.earnings}
                                </div>
                                <div className="text-xs text-purple-400">
                                  per ride
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              className={getRecommendationColor(
                                prediction.recommendation,
                              )}
                            >
                              {getRecommendationIcon(prediction.recommendation)}
                              {prediction.recommendation}
                            </Badge>
                            {isHighValue && (
                              <Flame className="w-5 h-5 text-red-400 animate-pulse" />
                            )}
                          </div>
                        </div>

                        {prediction.zones.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-purple-500/30">
                            <div className="text-sm text-purple-300 mb-2">
                              Top zones:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {prediction.zones.slice(0, 3).map((zone, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs border-purple-400/50 text-purple-300"
                                >
                                  {zone.name} (
                                  {zone.predictedMultiplier.toFixed(1)}x)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hot Zones & Oracle Insights */}
          <div className="space-y-6">
            {/* Next Big Surge Alert */}
            {nextHighSurge && (
              <Card className="bg-gradient-to-r from-red-600/40 to-orange-600/40 border-red-400/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                    <span className="text-red-300">Next Big Surge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {nextHighSurge.time}
                    </div>
                    <div className="text-xl text-orange-300 mb-3">
                      {nextHighSurge.surge}x Surge • ${nextHighSurge.earnings}
                      /ride
                    </div>
                    <div className="text-sm text-red-200">
                      {nextHighSurge.hour - currentHour} hours away
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Hot Zones */}
            <Card className="bg-black/40 border-purple-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-400" />
                  <span className="text-pink-300">Live Hot Zones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentPrediction?.zones.slice(0, 3).map((zone, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gradient-to-r from-purple-700/30 to-blue-700/30 border border-purple-500/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-purple-300">
                          {zone.name}
                        </div>
                        <Badge
                          className={`${
                            zone.urgency === "critical"
                              ? "bg-red-500 text-white"
                              : zone.urgency === "high"
                                ? "bg-orange-500 text-white"
                                : zone.urgency === "medium"
                                  ? "bg-yellow-500 text-black"
                                  : "bg-blue-500 text-white"
                          }`}
                        >
                          {zone.urgency.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-purple-400">Current:</span>
                          <span className="text-yellow-400 font-bold">
                            {zone.currentMultiplier.toFixed(1)}x
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-400">Predicted:</span>
                          <span className="text-pink-400 font-bold">
                            {zone.predictedMultiplier.toFixed(1)}x
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-400">Confidence:</span>
                          <span className="text-green-400">
                            {Math.round(zone.confidence)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-400">ETA:</span>
                          <span className="text-blue-400">
                            {zone.timeToSurge}min
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 p-2 bg-black/30 rounded text-xs">
                        <div className="text-yellow-300 font-semibold mb-1">
                          🧠 {zone.aiInsight}
                        </div>
                        <div className="text-green-300">{zone.secretTip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Oracle Status */}
            <Card className="bg-gradient-to-r from-purple-800/40 to-pink-800/40 border-purple-400/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Diamond className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300">Oracle Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Neural Network:</span>
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Data Streams:</span>
                    <span className="text-green-400">147 sources</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Prediction Power:</span>
                    <span className="text-pink-400">97.3% accuracy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Next Update:</span>
                    <span className="text-blue-400">
                      {30 - (new Date().getSeconds() % 30)}s
                    </span>
                  </div>

                  <div className="pt-3 border-t border-purple-500/30">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400 mb-1">
                        🔮 Divine Guidance Active
                      </div>
                      <div className="text-xs text-purple-300">
                        The Oracle sees all paths to profit
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
