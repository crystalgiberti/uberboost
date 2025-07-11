import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  Target,
  Zap,
  Eye,
  Car,
  Fuel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("week");

  // Mock data - in real app would come from API
  const weeklyEarnings = [
    { day: "Mon", earnings: 156, rides: 18, hours: 8.5 },
    { day: "Tue", earnings: 189, rides: 22, hours: 9.2 },
    { day: "Wed", earnings: 143, rides: 16, hours: 7.8 },
    { day: "Thu", earnings: 198, rides: 24, hours: 10.1 },
    { day: "Fri", earnings: 234, rides: 28, hours: 11.3 },
    { day: "Sat", earnings: 267, rides: 31, hours: 12.0 },
    { day: "Sun", earnings: 201, rides: 23, hours: 9.5 },
  ];

  const surgeStats = [
    {
      location: "Jacksonville Landing",
      avgMultiplier: 2.3,
      frequency: "High",
      earnings: "$450",
    },
    {
      location: "Riverside/Avondale",
      avgMultiplier: 1.9,
      frequency: "Medium",
      earnings: "$320",
    },
    {
      location: "Downtown",
      avgMultiplier: 1.6,
      frequency: "Medium",
      earnings: "$280",
    },
    {
      location: "Beach Blvd",
      avgMultiplier: 1.4,
      frequency: "Low",
      earnings: "$180",
    },
  ];

  const totalWeekly = weeklyEarnings.reduce(
    (sum, day) => sum + day.earnings,
    0,
  );
  const totalRides = weeklyEarnings.reduce((sum, day) => sum + day.rides, 0);
  const totalHours = weeklyEarnings.reduce((sum, day) => sum + day.hours, 0);
  const avgPerHour = totalWeekly / totalHours;
  const avgPerRide = totalWeekly / totalRides;

  const maxEarnings = Math.max(...weeklyEarnings.map((d) => d.earnings));

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
              <h1 className="text-lg font-bold text-foreground">Analytics</h1>
              <p className="text-xs text-muted-foreground">
                Performance insights
              </p>
            </div>
          </div>
          <Badge className="bg-florida-ocean text-white">
            This Week: ${totalWeekly.toFixed(0)}
          </Badge>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-florida-ocean/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-florida-ocean mx-auto mb-2" />
              <div className="text-2xl font-bold text-florida-ocean">
                ${avgPerHour.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Per Hour</div>
            </CardContent>
          </Card>
          <Card className="border-florida-sunset/20">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-florida-sunset mx-auto mb-2" />
              <div className="text-2xl font-bold text-florida-sunset">
                ${avgPerRide.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Per Ride</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card className="border-florida-ocean/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-florida-ocean" />
                Weekly Performance
              </span>
              <div className="text-sm text-muted-foreground">
                {totalRides} rides • {totalHours.toFixed(1)}h
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyEarnings.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{day.day}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-florida-ocean">
                        ${day.earnings}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.rides} rides
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-florida-ocean to-florida-ocean-dark h-2 rounded-full"
                      style={{
                        width: `${(day.earnings / maxEarnings) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Surge Analysis */}
        <Card className="border-florida-coral/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-florida-coral" />
              Surge Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {surgeStats.map((spot, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-florida-coral/20"
              >
                <div className="flex-1">
                  <div className="font-semibold text-sm">{spot.location}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs border-florida-coral text-florida-coral"
                    >
                      {spot.avgMultiplier}x avg
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {spot.frequency} frequency
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-florida-coral">
                    {spot.earnings}
                  </div>
                  <div className="text-xs text-muted-foreground">This week</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time Analysis */}
        <Card className="border-florida-palm/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-florida-palm" />
              Peak Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-florida-palm/10 rounded">
                <span className="text-sm">7-9 AM</span>
                <Badge className="bg-florida-palm text-white">Best ROI</Badge>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">5-7 PM</span>
                <span className="text-sm text-muted-foreground">
                  High demand
                </span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">9 PM-1 AM</span>
                <span className="text-sm text-muted-foreground">
                  Nightlife surge
                </span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">Weekend 2-6 PM</span>
                <span className="text-sm text-muted-foreground">
                  Event traffic
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="border-florida-sunset/20 bg-gradient-to-r from-white to-florida-sunset-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-florida-sunset" />
              Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Weekly Goal ($1,200)</span>
                <span className="text-sm font-semibold">${totalWeekly}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-florida-sunset to-florida-coral h-2 rounded-full"
                  style={{
                    width: `${Math.min((totalWeekly / 1200) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {((totalWeekly / 1200) * 100).toFixed(1)}% complete
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Rides Goal (150)</span>
                <span className="text-sm font-semibold">{totalRides}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-florida-ocean to-florida-sky h-2 rounded-full"
                  style={{
                    width: `${Math.min((totalRides / 150) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {((totalRides / 150) * 100).toFixed(1)}% complete
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-ocean/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-florida-ocean" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white/60 rounded-lg border border-florida-ocean/20">
              <div className="font-semibold text-sm text-florida-ocean">
                🎯 Focus on Jacksonville Landing
              </div>
              <div className="text-xs text-muted-foreground">
                Your highest earning location with 2.3x average surge
              </div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg border border-florida-sunset/20">
              <div className="font-semibold text-sm text-florida-sunset">
                ⏰ Start earlier on weekdays
              </div>
              <div className="text-xs text-muted-foreground">
                7-9 AM shows highest earnings per hour
              </div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg border border-florida-palm/20">
              <div className="font-semibold text-sm text-florida-palm">
                📅 Weekend optimization
              </div>
              <div className="text-xs text-muted-foreground">
                Saturday shows your best performance - replicate strategy
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
