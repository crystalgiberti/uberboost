import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Zap,
  Plus,
  Settings,
  TrendingUp,
  Sun,
  Moon,
  Coffee,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function Schedule() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("today");
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [isScheduleActive, setIsScheduleActive] = useState(false);
  const [currentScheduleItem, setCurrentScheduleItem] = useState<any>(null);
  const [scheduledStartTime, setScheduledStartTime] = useState<Date | null>(
    null,
  );

  const daysOfWeek = [
    { id: "today", label: "Today", date: "Dec 15" },
    { id: "tomorrow", label: "Tomorrow", date: "Dec 16" },
    { id: "monday", label: "Monday", date: "Dec 17" },
    { id: "tuesday", label: "Tuesday", date: "Dec 18" },
    { id: "wednesday", label: "Wednesday", date: "Dec 19" },
    { id: "thursday", label: "Thursday", date: "Dec 20" },
    { id: "friday", label: "Friday", date: "Dec 21" },
  ];

  const todaySchedule = [
    {
      time: "7:00 AM",
      type: "drive",
      title: "Morning Rush",
      location: "Downtown Jacksonville",
      earning: "$45-65",
      surge: "1.8x",
      confidence: 92,
      icon: Coffee,
    },
    {
      time: "9:30 AM",
      type: "break",
      title: "Break Recommendation",
      location: "Rest near UNF",
      earning: "Save gas",
      surge: null,
      confidence: null,
      icon: Coffee,
    },
    {
      time: "11:00 AM",
      type: "drive",
      title: "Airport Run",
      location: "JAX Airport",
      earning: "$35-50",
      surge: "1.4x",
      confidence: 78,
      icon: Car,
    },
    {
      time: "2:00 PM",
      type: "break",
      title: "Lunch Break",
      location: "Town Center area",
      earning: "Low demand",
      surge: null,
      confidence: null,
      icon: Sun,
    },
    {
      time: "5:00 PM",
      type: "drive",
      title: "Evening Rush",
      location: "Riverside/Avondale",
      earning: "$55-80",
      surge: "2.2x",
      confidence: 89,
      icon: TrendingUp,
    },
    {
      time: "8:00 PM",
      type: "drive",
      title: "Dinner & Nightlife",
      location: "Jacksonville Landing",
      earning: "$40-60",
      surge: "1.9x",
      confidence: 85,
      icon: Moon,
    },
  ];

  const weeklyGoal = {
    target: 1200,
    current: 890,
    hoursNeeded: 28,
    hoursScheduled: 35,
  };

  const getSurgeColor = (surge: string | null) => {
    if (!surge) return "";
    const multiplier = parseFloat(surge);
    if (multiplier >= 2.0) return "bg-surge-high";
    if (multiplier >= 1.5) return "bg-surge-medium";
    return "bg-surge-low";
  };

  const getCurrentScheduleItem = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const item of todaySchedule) {
      const [hour, minute] = item.time.split(/[: ]/).map(Number);
      const itemTime =
        (hour + (item.time.includes("PM") && hour !== 12 ? 12 : 0)) * 60 +
        minute;

      // Find the current or next scheduled item
      if (itemTime >= currentTime - 30) {
        // Within 30 minutes
        return item;
      }
    }
    return todaySchedule[0]; // Default to first item
  };

  const startSchedule = () => {
    const nextItem = getCurrentScheduleItem();
    setCurrentScheduleItem(nextItem);
    setIsScheduleActive(true);
    setScheduledStartTime(new Date());

    // Store in localStorage for persistence
    localStorage.setItem(
      "activeSchedule",
      JSON.stringify({
        item: nextItem,
        startTime: new Date().toISOString(),
        isActive: true,
      }),
    );

    // Navigate to appropriate page based on schedule item
    if (nextItem.type === "drive") {
      navigate("/surge-navigation", {
        state: {
          targetLocation: nextItem.location,
          expectedEarnings: nextItem.earning,
          expectedSurge: nextItem.surge,
          scheduledItem: nextItem,
        },
      });
    } else {
      // For break items, show notification and stay on schedule page
      alert(
        `Break time! ${nextItem.title} at ${nextItem.location}. ${nextItem.earning}`,
      );
    }
  };

  const stopSchedule = () => {
    setIsScheduleActive(false);
    setCurrentScheduleItem(null);
    setScheduledStartTime(null);
    localStorage.removeItem("activeSchedule");
  };

  // Load active schedule from localStorage on mount
  useState(() => {
    const savedSchedule = localStorage.getItem("activeSchedule");
    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule);
        if (parsed.isActive) {
          setCurrentScheduleItem(parsed.item);
          setIsScheduleActive(true);
          setScheduledStartTime(new Date(parsed.startTime));
        }
      } catch (e) {
        localStorage.removeItem("activeSchedule");
      }
    }
  });

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
              <h1 className="text-lg font-bold text-foreground">Schedule</h1>
              <p className="text-xs text-muted-foreground">
                AI-optimized driving times
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Weekly Goal Progress */}
        <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-ocean/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-florida-ocean" />
                Weekly Progress
              </span>
              <Badge className="bg-florida-ocean text-white">
                ${weeklyGoal.current}/${weeklyGoal.target}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-florida-ocean to-florida-ocean-dark h-3 rounded-full"
                  style={{
                    width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {weeklyGoal.hoursScheduled}h scheduled
                </span>
                <span className="text-florida-ocean font-semibold">
                  ${weeklyGoal.target - weeklyGoal.current} to go
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Schedule Toggle */}
        <Card className="border-florida-palm/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">AI Auto-Schedule</div>
                <div className="text-sm text-muted-foreground">
                  Let AI optimize your driving schedule
                </div>
              </div>
              <Switch
                checked={autoSchedule}
                onCheckedChange={setAutoSchedule}
              />
            </div>
          </CardContent>
        </Card>

        {/* Day Selector */}
        <div className="space-y-3">
          <h3 className="font-semibold">Select Day</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {daysOfWeek.map((day) => (
              <Button
                key={day.id}
                variant={selectedDay === day.id ? "default" : "outline"}
                className={`min-w-[80px] flex-col h-auto py-2 ${
                  selectedDay === day.id
                    ? "bg-florida-ocean text-white"
                    : "border-florida-ocean/30"
                }`}
                onClick={() => setSelectedDay(day.id)}
              >
                <span className="text-xs">{day.label}</span>
                <span className="text-xs opacity-80">{day.date}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <Card className="border-florida-ocean/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-florida-ocean" />
                Today's Schedule
              </span>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  item.type === "drive"
                    ? "bg-white/80 border-florida-ocean/20"
                    : "bg-gray-50/80 border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.type === "drive"
                          ? "bg-florida-ocean/20"
                          : "bg-gray-200"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          item.type === "drive"
                            ? "text-florida-ocean"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {item.time}
                        </span>
                        {item.surge && (
                          <Badge
                            className={`${getSurgeColor(item.surge)} text-white text-xs`}
                          >
                            {item.surge}
                          </Badge>
                        )}
                      </div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold text-sm ${
                        item.type === "drive"
                          ? "text-florida-ocean"
                          : "text-gray-500"
                      }`}
                    >
                      {item.earning}
                    </div>
                    {item.confidence && (
                      <div className="text-xs text-muted-foreground">
                        {item.confidence}% confidence
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Schedule Optimization Tips */}
        <Card className="border-florida-sunset/20 bg-gradient-to-r from-white to-florida-sunset-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-florida-sunset" />
              Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-sunset">
                🎯 Peak Hour Focus
              </div>
              <div className="text-xs text-muted-foreground">
                7-9 AM and 5-7 PM show 40% higher earnings
              </div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-ocean">
                📍 Location Strategy
              </div>
              <div className="text-xs text-muted-foreground">
                Stay near Jacksonville Landing for consistent surge
                opportunities
              </div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-palm">
                ⏰ Break Timing
              </div>
              <div className="text-xs text-muted-foreground">
                Take breaks during 2-4 PM low demand period to save fuel
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-12 bg-florida-ocean hover:bg-florida-ocean-dark text-white">
            <Clock className="w-5 h-5 mr-2" />
            Start Schedule
          </Button>
          <Button
            variant="outline"
            className="h-12 border-florida-sunset text-florida-sunset hover:bg-florida-sunset hover:text-white"
          >
            <Settings className="w-5 h-5 mr-2" />
            Customize
          </Button>
        </div>
      </div>
    </div>
  );
}
