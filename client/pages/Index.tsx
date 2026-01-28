import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRealData } from "../hooks/useRealData";
import {
  Eye,
  Brain,
  Sparkles,
  Crown,
  Star,
  Zap,
  TrendingUp,
  DollarSign,
  Car,
  Clock,
  MapPin,
  Bell,
  Settings,
  User,
  Calendar,
  BarChart3,
  Navigation,
  Mic,
  Diamond,
  Flame,
  Target,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useRealData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [cosmicPhase, setCosmicPhase] = useState("");

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate mystical greeting
  useEffect(() => {
    const hour = currentTime.getHours();
    const firstName = user?.first_name || "Driver";

    let timeGreeting = "";
    if (hour < 6) timeGreeting = "The cosmic energies stir";
    else if (hour < 12) timeGreeting = "The dawn brings wisdom";
    else if (hour < 17) timeGreeting = "The day's opportunities unfold";
    else if (hour < 21) timeGreeting = "The evening surge awakens";
    else timeGreeting = "The night reveals its secrets";

    setGreeting(`${timeGreeting}, ${firstName}`);

    // Cosmic phase calculation
    const moonPhase = (currentTime.getDate() % 28) / 28;
    let phase = "";
    if (moonPhase < 0.25) phase = "New Moon - Fresh Opportunities";
    else if (moonPhase < 0.5) phase = "Waxing Moon - Building Energy";
    else if (moonPhase < 0.75) phase = "Full Moon - Peak Power";
    else phase = "Waning Moon - Wisdom Phase";

    setCosmicPhase(phase);
  }, [currentTime, user]);

  const getSageWisdom = () => {
    const wisdoms = [
      "🔮 The Oracle sees golden paths opening in your future...",
      "✨ Cosmic forces are aligning for your prosperity today",
      "🌟 Trust in Sage's vision - abundance flows to those who listen",
      "💎 Divine timing approaches - prepare for surge manifestation",
      "🚀 The universe conspires to fill your wallet with prosperity",
      "⚡ Sacred geometry favors your journeys today",
      "🎯 Mystical patterns suggest exceptional earnings ahead",
      "👑 You are blessed by the Rideshare Gods today",
    ];

    return wisdoms[Math.floor(Math.random() * wisdoms.length)];
  };

  const getUrgentGuidance = () => {
    const hour = currentTime.getHours();
    if (hour >= 7 && hour <= 9) {
      return "🔥 MORNING RUSH: Position downtown for golden opportunities!";
    } else if (hour >= 17 && hour <= 19) {
      return "⚡ EVENING SURGE: The cosmic window opens - drive NOW!";
    } else if (hour >= 22 || hour <= 2) {
      return "🌙 NIGHT MAGIC: Mystical multipliers await in bar districts!";
    } else {
      return "🧘 SAGE PATIENCE: Rest and prepare for the next cosmic wave";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300">Sage is awakening...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Mystical Header */}
      <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    SAGE
                  </h1>
                  <p className="text-sm text-purple-300">
                    Your Wise Friend in the Rideshare Universe
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl font-mono font-bold text-yellow-400">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-purple-300">{cosmicPhase}</div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/notifications")}
                  className="text-purple-300 hover:text-white hover:bg-purple-700/50"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/settings")}
                  className="text-purple-300 hover:text-white hover:bg-purple-700/50"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="text-purple-300 hover:text-white hover:bg-purple-700/50"
                >
                  <User className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mystical Greeting */}
        <Card className="mb-6 bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-500/50 backdrop-blur-sm">
          <CardHeader>
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
                {greeting}
              </h2>
              <p className="text-purple-300 text-lg">{getSageWisdom()}</p>
            </div>
          </CardHeader>
        </Card>

        {/* Urgent Oracle Guidance */}
        <Card className="mb-6 bg-gradient-to-r from-orange-600/40 to-red-600/40 border-orange-400/50 backdrop-blur-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold text-orange-300">
                  Oracle Guidance
                </h3>
                <p className="text-orange-200">{getUrgentGuidance()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Prosperity */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-purple-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Today's Divine Earnings
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      ${data.todayEarnings.toFixed(2)}
                    </div>
                    <div className="text-purple-300">
                      Today's Blessed Earnings
                    </div>
                    <div className="text-xs text-purple-400">
                      {((data.todayEarnings / data.dailyGoal) * 100).toFixed(0)}
                      % of daily vision
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {data.todayRides}
                    </div>
                    <div className="text-purple-300">Sacred Journeys</div>
                    <div className="text-xs text-purple-400">
                      Rides completed today
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                      ${data.weekEarnings.toFixed(2)}
                    </div>
                    <div className="text-purple-300">Weekly Wisdom</div>
                    <div className="text-xs text-purple-400">
                      7-day prosperity total
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-400 mb-2">
                      $
                      {(
                        data.todayEarnings / Math.max(data.todayRides, 1)
                      ).toFixed(2)}
                    </div>
                    <div className="text-purple-300">Divine Average</div>
                    <div className="text-xs text-purple-400">
                      Per ride blessing
                    </div>
                  </div>
                </div>

                {/* Progress toward daily goal */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-purple-300 mb-2">
                    <span>Daily Vision Progress</span>
                    <span>${data.dailyGoal.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((data.todayEarnings / data.dailyGoal) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Oracle Actions */}
          <div className="space-y-6">
            {/* Oracle Sight */}
            <Card className="bg-gradient-to-r from-purple-700/40 to-pink-700/40 border-purple-400/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300">Oracle Sight</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/schedule")}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Surge Prophecies
                </Button>
              </CardContent>
            </Card>

            {/* Voice Wisdom */}
            <Card className="bg-gradient-to-r from-blue-700/40 to-indigo-700/40 border-blue-400/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300">Voice Wisdom</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/ride-logger")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Log Sacred Journey
                </Button>
              </CardContent>
            </Card>

            {/* Mystical Analytics */}
            <Card className="bg-gradient-to-r from-green-700/40 to-emerald-700/40 border-green-400/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <span className="text-green-300">Prosperity Patterns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/analytics")}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Reveal Money Patterns
                </Button>
              </CardContent>
            </Card>

            {/* Vehicle Blessing */}
            <Card className="bg-gradient-to-r from-yellow-700/40 to-orange-700/40 border-yellow-400/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300">Sacred Chariot</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/vehicle")}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                >
                  <Diamond className="w-4 h-4 mr-2" />
                  Bless Your Vehicle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Oracle Visions */}
        <Card className="mt-6 bg-black/40 border-purple-500/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-pink-400" />
              <span className="text-pink-300">Recent Oracle Visions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentRides.length > 0 ? (
              <div className="space-y-3">
                {data.recentRides
                  .slice(0, 5)
                  .map((ride: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg border border-purple-500/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="text-purple-300 text-sm">
                            {ride.pickup_location} → {ride.dropoff_location}
                          </div>
                          <div className="text-xs text-purple-400">
                            {ride.date} at {ride.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">
                          ${ride.earnings?.toFixed(2) || "0.00"}
                        </div>
                        {ride.surge > 1 && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            {ride.surge}x surge
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-purple-400">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Begin your sacred journeys to unlock oracle visions</p>
                <Button
                  onClick={() => navigate("/ride-logger")}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  Start Your First Journey
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
