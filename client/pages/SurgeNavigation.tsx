import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Clock,
  Zap,
  Eye,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SurgeArea {
  location: string;
  address: string;
  multiplier: number;
  estimatedTime: string;
  reason: string;
  confidence: number;
  coordinates: { lat: number; lng: number };
  distance: number;
}

export default function SurgeNavigation() {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<SurgeArea | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock surge areas for Jacksonville
  const surgeAreas: SurgeArea[] = [
    {
      location: "Jacksonville Landing",
      address: "2 Independent Dr, Jacksonville, FL 32202",
      multiplier: 2.8,
      estimatedTime: "8 min",
      reason: "Jaguars game ending",
      confidence: 94,
      coordinates: { lat: 30.3272, lng: -81.6569 },
      distance: 0.7,
    },
    {
      location: "Riverside/Avondale",
      address: "1052 King St, Jacksonville, FL 32204",
      multiplier: 2.3,
      estimatedTime: "15 min",
      reason: "Nightlife district",
      confidence: 87,
      coordinates: { lat: 30.3156, lng: -81.6906 },
      distance: 2.3,
    },
    {
      location: "Town Center",
      address: "5100 Big Island Dr, Jacksonville, FL 32246",
      multiplier: 2.1,
      estimatedTime: "22 min",
      reason: "Shopping center rush",
      confidence: 81,
      coordinates: { lat: 30.2672, lng: -81.4943 },
      distance: 4.8,
    },
    {
      location: "UNF Campus",
      address: "1 UNF Dr, Jacksonville, FL 32224",
      multiplier: 1.9,
      estimatedTime: "18 min",
      reason: "Student pickup surge",
      confidence: 76,
      coordinates: { lat: 30.2692, lng: -81.507 },
      distance: 3.2,
    },
    {
      location: "Jacksonville Beach",
      address: "503 1st St N, Jacksonville Beach, FL 32250",
      multiplier: 1.8,
      estimatedTime: "28 min",
      reason: "Beach events",
      confidence: 73,
      coordinates: { lat: 30.2941, lng: -81.3934 },
      distance: 8.1,
    },
  ];

  useEffect(() => {
    if (!selectedArea && surgeAreas.length > 0) {
      setSelectedArea(surgeAreas[0]);
    }
  }, []);

  const getSurgeColor = (multiplier: number) => {
    if (multiplier >= 2.5) return "bg-surge-very-high";
    if (multiplier >= 2.0) return "bg-surge-high";
    if (multiplier >= 1.5) return "bg-surge-medium";
    return "bg-surge-low";
  };

  const handleNavigate = (area: SurgeArea) => {
    // In real app, would open native navigation app
    const googleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(area.address)}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh surge data
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-florida-ocean/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Surge Navigation
              </h1>
              <p className="text-xs text-muted-foreground">
                Navigate to highest earning areas
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Selected Area Details */}
        {selectedArea && (
          <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-ocean/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-florida-ocean" />
                  Selected Destination
                </span>
                <Badge
                  className={`${getSurgeColor(selectedArea.multiplier)} text-white`}
                >
                  {selectedArea.multiplier}x Surge
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-florida-ocean">
                  {selectedArea.location}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedArea.address}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-florida-sunset">
                    {selectedArea.estimatedTime}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Drive Time
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-florida-coral">
                    {selectedArea.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confidence
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-florida-palm">
                    {selectedArea.distance} mi
                  </div>
                  <div className="text-xs text-muted-foreground">Distance</div>
                </div>
              </div>

              <div className="p-3 bg-white/60 rounded-lg">
                <div className="font-semibold text-sm text-florida-ocean">
                  📍 Surge Reason
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedArea.reason}
                </div>
              </div>

              <Button
                className="w-full h-12 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
                onClick={() => handleNavigate(selectedArea)}
              >
                <Navigation className="w-5 h-5 mr-2" />
                Start Navigation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* All Surge Areas */}
        <Card className="border-florida-sunset/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-florida-sunset" />
              All Surge Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {surgeAreas.map((area, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedArea?.location === area.location
                    ? "border-florida-ocean bg-florida-ocean/10"
                    : "border-gray-200 bg-white/50 hover:border-florida-ocean/50"
                }`}
                onClick={() => setSelectedArea(area)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{area.location}</span>
                      <Badge
                        className={`${getSurgeColor(area.multiplier)} text-white text-xs`}
                      >
                        {area.multiplier}x
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {area.reason}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {area.estimatedTime}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {area.distance} mi
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {area.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(area);
                    }}
                    className="border-florida-ocean text-florida-ocean hover:bg-florida-ocean hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation Tips */}
        <Card className="border-florida-palm/20 bg-gradient-to-r from-white to-florida-palm/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-florida-palm" />
              Navigation Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-palm">
                🎯 Positioning Strategy
              </div>
              <div className="text-xs text-muted-foreground">
                Arrive 5-10 minutes before peak surge time for best positioning
              </div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-ocean">
                ⏱️ Timing is Key
              </div>
              <div className="text-xs text-muted-foreground">
                Surge levels can change rapidly - monitor in real-time
              </div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-sunset">
                🚗 Fuel Efficiency
              </div>
              <div className="text-xs text-muted-foreground">
                Choose closer surge areas to maximize profit vs fuel cost
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
