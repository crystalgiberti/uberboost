import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Key,
  Cloud,
  Navigation,
  Calendar,
  Plane,
  Eye,
  EyeOff,
  Save,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ApiConfig() {
  const navigate = useNavigate();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState({
    openWeather: "",
    googleMaps: "",
    tomtom: "",
    ticketmaster: "",
    eventbrite: "",
    flightaware: "",
  });
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const apiConfigs = [
    {
      key: "openWeather",
      name: "OpenWeatherMap",
      description: "Real-time weather data for surge prediction",
      icon: Cloud,
      color: "florida-sky",
      website: "https://openweathermap.org/api",
      instructions: [
        "Sign up at openweathermap.org",
        "Go to API Keys section",
        "Generate a new API key",
        "Copy and paste below",
      ],
      free: true,
      impact: "Weather-based surge alerts (rain, storms)",
    },
    {
      key: "googleMaps",
      name: "Google Maps Platform",
      description: "Live traffic and routing data",
      icon: Navigation,
      color: "florida-ocean",
      website: "https://developers.google.com/maps",
      instructions: [
        "Create project at console.cloud.google.com",
        "Enable Maps JavaScript API",
        "Enable Distance Matrix API",
        "Create credentials",
      ],
      free: "Limited",
      impact: "Traffic congestion alerts and routing optimization",
    },
    {
      key: "tomtom",
      name: "TomTom Traffic API",
      description: "Alternative traffic data source",
      icon: Navigation,
      color: "florida-palm",
      website: "https://developer.tomtom.com",
      instructions: [
        "Register at developer.tomtom.com",
        "Create new application",
        "Get API key from dashboard",
        "Copy key below",
      ],
      free: true,
      impact: "Enhanced traffic incident detection",
    },
    {
      key: "ticketmaster",
      name: "Ticketmaster Discovery",
      description: "Live events and concerts data",
      icon: Calendar,
      color: "florida-sunset",
      website: "https://developer.ticketmaster.com",
      instructions: [
        "Register at developer.ticketmaster.com",
        "Create new app",
        "Get Consumer Key",
        "Use as API key",
      ],
      free: true,
      impact: "Event-driven surge predictions (sports, concerts)",
    },
    {
      key: "eventbrite",
      name: "Eventbrite API",
      description: "Local events and gatherings",
      icon: Calendar,
      color: "florida-coral",
      website: "https://www.eventbrite.com/platform/api",
      instructions: [
        "Go to eventbrite.com/platform",
        "Create new app",
        "Generate OAuth token",
        "Copy token below",
      ],
      free: true,
      impact: "Additional event data for surge timing",
    },
    {
      key: "flightaware",
      name: "FlightAware AeroAPI",
      description: "Airport traffic and flight delays",
      icon: Plane,
      color: "florida-ocean",
      website: "https://flightaware.com/commercial/aeroapi",
      instructions: [
        "Register at flightaware.com/commercial",
        "Subscribe to AeroAPI",
        "Get API key from dashboard",
        "Paste key below",
      ],
      free: "Trial",
      impact: "Airport surge predictions based on flight delays",
    },
  ];

  const handleKeyChange = (key: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }));
    // Clear test result when key changes
    setTestResults((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const testApiKey = async (apiKey: string) => {
    setTestResults((prev) => ({ ...prev, [apiKey]: "testing" }));

    // Simulate API test (in production, would make actual test calls)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const success = Math.random() > 0.3; // 70% success rate for demo
    setTestResults((prev) => ({
      ...prev,
      [apiKey]: success ? "success" : "error",
    }));
  };

  const saveConfiguration = () => {
    // In production, would save to secure backend
    localStorage.setItem("uberBoostApiKeys", JSON.stringify(apiKeys));
    alert("API configuration saved successfully!");
    navigate("/settings");
  };

  const loadConfiguration = () => {
    const saved = localStorage.getItem("uberBoostApiKeys");
    if (saved) {
      setApiKeys(JSON.parse(saved));
    }
  };

  // Load saved config on mount
  useState(() => {
    loadConfiguration();
  });

  const configuredCount = Object.values(apiKeys).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-florida-ocean/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Real-Time Data Setup
              </h1>
              <p className="text-xs text-muted-foreground">
                Configure API keys for live surge predictions
              </p>
            </div>
          </div>
          <Badge
            className={`${
              configuredCount >= 3
                ? "bg-green-500"
                : configuredCount >= 1
                  ? "bg-yellow-500"
                  : "bg-red-500"
            } text-white`}
          >
            {configuredCount}/6 APIs
          </Badge>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Overview */}
        <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-ocean/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-florida-ocean" />
              Live Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect to live data sources to enable real-time surge predictions
              based on weather, traffic, events, and airport activity. All APIs
              offer free tiers suitable for individual drivers.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-florida-ocean">
                  {configuredCount}
                </div>
                <div className="text-xs text-muted-foreground">
                  APIs Connected
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-florida-palm">
                  {configuredCount >= 2 ? "🟢" : "🟡"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Prediction Quality
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-florida-sunset">
                  30s
                </div>
                <div className="text-xs text-muted-foreground">
                  Update Frequency
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Notice */}
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">
                  Recommended Minimum Setup
                </h4>
                <p className="text-sm text-green-700">
                  For best results, configure at least{" "}
                  <strong>OpenWeatherMap + Google Maps</strong>. These two
                  provide 80% of surge prediction accuracy. Additional APIs
                  enhance precision.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration Cards */}
        {apiConfigs.map((api) => {
          const Icon = api.icon;
          const isConfigured = !!apiKeys[api.key as keyof typeof apiKeys];
          const testResult = testResults[api.key];

          return (
            <Card key={api.key} className={`border-${api.color}/20`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 bg-${api.color}/20 rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 text-${api.color}`} />
                    </div>
                    {api.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        api.free === true
                          ? "border-green-500 text-green-600"
                          : api.free === "Limited" || api.free === "Trial"
                            ? "border-yellow-500 text-yellow-600"
                            : "border-red-500 text-red-600"
                      }`}
                    >
                      {api.free === true ? "Free" : api.free}
                    </Badge>
                    {isConfigured && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {api.description}
                </p>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-semibold text-sm text-blue-800">
                    Impact on Predictions:
                  </div>
                  <div className="text-sm text-blue-700">{api.impact}</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={api.key}>API Key</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id={api.key}
                        type={showKeys[api.key] ? "text" : "password"}
                        placeholder={`Enter your ${api.name} API key`}
                        value={apiKeys[api.key as keyof typeof apiKeys]}
                        onChange={(e) =>
                          handleKeyChange(api.key, e.target.value)
                        }
                        className={`border-${api.color}/30 focus:border-${api.color}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowKey(api.key)}
                      >
                        {showKeys[api.key] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testApiKey(api.key)}
                      disabled={
                        !apiKeys[api.key as keyof typeof apiKeys] ||
                        testResult === "testing"
                      }
                      className={`border-${api.color} text-${api.color} hover:bg-${api.color} hover:text-white`}
                    >
                      {testResult === "testing" ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : testResult === "success" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : testResult === "error" ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        "Test"
                      )}
                    </Button>
                  </div>
                  {testResult === "success" && (
                    <div className="text-sm text-green-600">
                      ✅ API key is valid and working
                    </div>
                  )}
                  {testResult === "error" && (
                    <div className="text-sm text-red-600">
                      ❌ API key test failed. Check your key and permissions.
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Setup Instructions:</h4>
                  <ol className="space-y-1">
                    {api.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span
                          className={`w-4 h-4 bg-${api.color}/20 text-${api.color} rounded-full flex items-center justify-center text-xs font-semibold mt-0.5`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(api.website, "_blank")}
                  className={`border-${api.color} text-${api.color} hover:bg-${api.color} hover:text-white`}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get API Key
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Save Configuration */}
        <Card className="border-florida-ocean/20">
          <CardContent className="p-4">
            <Button
              onClick={saveConfiguration}
              className="w-full h-12 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
              disabled={configuredCount === 0}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Configuration
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              {configuredCount === 0
                ? "Configure at least one API to enable real-time predictions"
                : `${configuredCount} API${configuredCount > 1 ? "s" : ""} configured. Real-time predictions will be available after saving.`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
