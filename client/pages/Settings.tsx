import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Moon,
  Volume2,
  MapPin,
  DollarSign,
  Car,
  Smartphone,
  Globe,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    soundEffects: true,
    voiceNavigation: true,
    autoAcceptUberX: false,
    autoAcceptUberXL: false,
    surgeAlerts: true,
    weatherAlerts: true,
    trafficAlerts: true,
    gasAlerts: true,
    minSurgeMultiplier: [1.5],
    maxDriveDistance: [10],
    language: "en",
    units: "imperial",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const settingsSections = [
    {
      title: "App Preferences",
      icon: Smartphone,
      items: [
        {
          type: "switch",
          key: "darkMode",
          label: "Dark Mode",
          description: "Switch to dark theme",
          icon: Moon,
        },
        {
          type: "switch",
          key: "soundEffects",
          label: "Sound Effects",
          description: "App sounds and alerts",
          icon: Volume2,
        },
        {
          type: "switch",
          key: "voiceNavigation",
          label: "Voice Navigation",
          description: "Voice-guided directions",
          icon: Volume2,
        },
        {
          type: "select",
          key: "language",
          label: "Language",
          description: "App language",
          icon: Globe,
          options: [
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
            { value: "ht", label: "Kreyòl Ayisyen" },
          ],
        },
      ],
    },
    {
      title: "Ride Preferences",
      icon: Car,
      items: [
        {
          type: "switch",
          key: "autoAcceptUberX",
          label: "Auto-Accept UberX",
          description: "Automatically accept UberX requests",
          icon: Car,
        },
        {
          type: "switch",
          key: "autoAcceptUberXL",
          label: "Auto-Accept UberXL",
          description: "Automatically accept UberXL requests",
          icon: Car,
        },
        {
          type: "slider",
          key: "maxDriveDistance",
          label: "Max Drive Distance",
          description: "Maximum distance to drive for pickup",
          icon: MapPin,
          unit: "miles",
          min: 1,
          max: 20,
        },
      ],
    },
    {
      title: "Surge & Earnings",
      icon: DollarSign,
      items: [
        {
          type: "switch",
          key: "surgeAlerts",
          label: "Surge Alerts",
          description: "Get notified of surge opportunities",
          icon: DollarSign,
        },
        {
          type: "slider",
          key: "minSurgeMultiplier",
          label: "Minimum Surge Alert",
          description: "Only alert for surges above this multiplier",
          icon: DollarSign,
          unit: "x",
          min: 1.2,
          max: 3.0,
          step: 0.1,
        },
      ],
    },
    {
      title: "Smart Alerts",
      icon: Bell,
      items: [
        {
          type: "switch",
          key: "notifications",
          label: "Push Notifications",
          description: "Allow app notifications",
          icon: Bell,
        },
        {
          type: "switch",
          key: "weatherAlerts",
          label: "Weather Alerts",
          description: "Notifications for weather-related demand",
          icon: Bell,
        },
        {
          type: "switch",
          key: "trafficAlerts",
          label: "Traffic Alerts",
          description: "Notifications for traffic incidents",
          icon: Bell,
        },
        {
          type: "switch",
          key: "gasAlerts",
          label: "Gas Price Alerts",
          description: "Notifications for cheap gas nearby",
          icon: Bell,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-florida-ocean/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Settings</h1>
              <p className="text-xs text-muted-foreground">
                Customize your experience
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="border-florida-ocean/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-florida-ocean" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <item.icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>

                        {item.type === "slider" && (
                          <div className="mt-2 space-y-2">
                            <input
                              type="range"
                              min={item.min}
                              max={item.max}
                              step={item.step || 1}
                              value={
                                (
                                  settings[
                                    item.key as keyof typeof settings
                                  ] as number[]
                                )[0]
                              }
                              onChange={(e) =>
                                handleSettingChange(item.key, [
                                  Number(e.target.value),
                                ])
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-xs text-muted-foreground">
                              Current:{" "}
                              {
                                (
                                  settings[
                                    item.key as keyof typeof settings
                                  ] as number[]
                                )[0]
                              }
                              {item.unit}
                            </div>
                          </div>
                        )}

                        {item.type === "select" && (
                          <div className="mt-2">
                            <Select
                              value={
                                settings[
                                  item.key as keyof typeof settings
                                ] as string
                              }
                              onValueChange={(value) =>
                                handleSettingChange(item.key, value)
                              }
                            >
                              <SelectTrigger className="w-full border-florida-ocean/30 focus:border-florida-ocean">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {item.options?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.type === "switch" && (
                      <Switch
                        checked={
                          settings[item.key as keyof typeof settings] as boolean
                        }
                        onCheckedChange={(checked) =>
                          handleSettingChange(item.key, checked)
                        }
                      />
                    )}
                  </div>

                  {itemIndex < section.items.length - 1 && (
                    <hr className="border-gray-200" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Real-Time Data */}
        <Card className="border-florida-ocean/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-florida-ocean" />
              Real-Time Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/api-config")}
            >
              <Globe className="w-5 h-5 mr-3" />
              Configure Live Data Sources
            </Button>
            <p className="text-xs text-muted-foreground">
              Set up weather, traffic, and event APIs for real-time surge
              predictions
            </p>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-florida-sunset/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-florida-sunset" />
              Account & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/privacy")}
            >
              <Shield className="w-5 h-5 mr-3" />
              Privacy Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/help")}
            >
              <HelpCircle className="w-5 h-5 mr-3" />
              Help & Support
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          className="w-full h-12 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
          onClick={() => {
            // In real app, would save settings to backend
            console.log("Saved settings:", settings);
            navigate("/profile");
          }}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
