import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { xhrRidesAPI, xhrVehicleAPI } from "../services/xhrApi";
import { useVehicleData } from "../hooks/useRealData";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Plus,
  MapPin,
  DollarSign,
  Clock,
  Car,
  TrendingUp,
  Download,
  Edit,
  Trash2,
  Volume2,
  PlayCircle,
  StopCircle,
  Save,
  X,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ride {
  id: string;
  date: string;
  time: string;
  pickup_location: string;
  dropoff_location: string;
  ride_type: string;
  earnings: number;
  surge: number;
  duration: number;
  distance: number;
  tips: number;
  notes: string;
  vehicle_id?: string;
}

export default function RideLogger() {
  const navigate = useNavigate();
  const { vehicles } = useVehicleData();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Form state
  const [showManualForm, setShowManualForm] = useState(false);
  const [editingRide, setEditingRide] = useState<Ride | null>(null);
  const [newRide, setNewRide] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    pickup_location: "",
    dropoff_location: "",
    ride_type: "UberX",
    earnings: 0,
    surge: 1.0,
    duration: 0,
    distance: 0,
    tips: 0,
    notes: "",
    vehicle_id: vehicles.length > 0 ? vehicles[0].id : "",
  });

  // Filter state
  const [dateFilter, setDateFilter] = useState("today");
  const [rideTypeFilter, setRideTypeFilter] = useState("all");

  useEffect(() => {
    initializeVoiceRecognition();
    loadRides();
  }, []);

  useEffect(() => {
    if (vehicles.length > 0 && !newRide.vehicle_id) {
      setNewRide((prev) => ({ ...prev, vehicle_id: vehicles[0].id }));
    }
  }, [vehicles]);

  const initializeVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        parseVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError(`Voice recognition error: ${event.error}`);
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };

      setVoiceSupported(true);
    } else {
      console.log("Speech recognition not supported");
      setVoiceSupported(false);
    }
  };

  const parseVoiceInput = (transcript: string) => {
    try {
      const text = transcript.toLowerCase();
      console.log("Parsing voice input:", text);

      // Extract locations
      const fromMatch = text.match(
        /(?:from|pickup at|starting at)\s+([^,]+?)(?:\s+to|\s+drop|\s+going)/,
      );
      const toMatch = text.match(
        /(?:to|dropoff|drop off|going to|ending at)\s+([^,]+?)(?:\s+for|\s+\$|\s+twenty|\s+uber|\s+lyft|$)/,
      );

      // Extract earnings
      const earningsMatch = text.match(
        /\$?([\d.]+)\s*(?:dollars?|bucks?|$)|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s*(?:five|six|seven|eight|nine)?\s*(?:dollars?|bucks?)/,
      );

      // Extract ride type
      let rideType = "UberX";
      if (text.includes("uber xl") || text.includes("xl")) rideType = "Uber XL";
      else if (text.includes("uber black") || text.includes("black"))
        rideType = "Uber Black";
      else if (text.includes("lyft")) rideType = "Lyft";
      else if (text.includes("delivery") || text.includes("eats"))
        rideType = "Delivery";

      // Extract surge
      const surgeMatch = text.match(/([\d.]+)\s*(?:x|times?)\s*surge/);

      // Update form
      const updates: any = { ride_type: rideType };

      if (fromMatch) updates.pickup_location = fromMatch[1].trim();
      if (toMatch) updates.dropoff_location = toMatch[1].trim();
      if (earningsMatch) {
        const amount = parseFloat(earningsMatch[1]) || parseWordNumber(text);
        if (amount > 0) updates.earnings = amount;
      }
      if (surgeMatch) updates.surge = parseFloat(surgeMatch[1]);

      setNewRide((prev) => ({ ...prev, ...updates }));

      // If we have enough info, save automatically
      if (
        updates.pickup_location &&
        updates.dropoff_location &&
        updates.earnings
      ) {
        setTimeout(() => {
          handleQuickSave(updates);
        }, 1000);
      }
    } catch (err) {
      console.error("Error parsing voice input:", err);
      setError(
        'Could not parse voice input. Try saying: "From downtown to airport, UberX, twenty five dollars"',
      );
    }
  };

  const parseWordNumber = (text: string): number => {
    const numbers: { [key: string]: number } = {
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      fifteen: 15,
      twenty: 20,
      "twenty five": 25,
      thirty: 30,
      "thirty five": 35,
      forty: 40,
      "forty five": 45,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90,
      hundred: 100,
    };

    for (const [word, num] of Object.entries(numbers)) {
      if (text.includes(word)) return num;
    }
    return 0;
  };

  const startVoiceRecording = () => {
    if (!voiceSupported) {
      setError(
        "Voice recognition is not supported in this browser. Try Chrome or Safari.",
      );
      return;
    }

    if (recognitionRef.current) {
      setIsRecording(true);
      setVoiceTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const loadRides = async () => {
    try {
      setIsLoading(true);
      const response = await xhrRidesAPI.getRides(1, 100); // Load recent 100 rides
      setRides(response.rides || []);
    } catch (err) {
      console.error("Failed to load rides:", err);
      setError("Failed to load rides");
      setRides([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSave = async (overrides: any = {}) => {
    try {
      const rideData = { ...newRide, ...overrides };

      // Validate required fields
      if (
        !rideData.pickup_location ||
        !rideData.dropoff_location ||
        !rideData.earnings
      ) {
        setError(
          "Please provide pickup location, dropoff location, and earnings amount",
        );
        return;
      }

      await xhrRidesAPI.createRide({
        ...rideData,
        earnings: parseFloat(rideData.earnings.toString()),
        surge: parseFloat(rideData.surge.toString()),
        duration: parseInt(rideData.duration.toString()),
        distance: parseFloat(rideData.distance.toString()),
        tips: parseFloat(rideData.tips.toString()),
      });

      // Reset form
      setNewRide({
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        pickup_location: "",
        dropoff_location: "",
        ride_type: "UberX",
        earnings: 0,
        surge: 1.0,
        duration: 0,
        distance: 0,
        tips: 0,
        notes: "",
        vehicle_id: vehicles.length > 0 ? vehicles[0].id : "",
      });

      setVoiceTranscript("");
      setShowManualForm(false);
      await loadRides(); // Refresh the list
    } catch (err) {
      console.error("Failed to save ride:", err);
      setError("Failed to save ride");
    }
  };

  const handleEditRide = (ride: Ride) => {
    setEditingRide(ride);
    setNewRide({
      date: ride.date,
      time: ride.time,
      pickup_location: ride.pickup_location,
      dropoff_location: ride.dropoff_location,
      ride_type: ride.ride_type,
      earnings: ride.earnings,
      surge: ride.surge,
      duration: ride.duration,
      distance: ride.distance,
      tips: ride.tips,
      notes: ride.notes,
      vehicle_id: ride.vehicle_id || "",
    });
    setShowManualForm(true);
  };

  const handleUpdateRide = async () => {
    if (!editingRide) return;

    try {
      // Note: This would need an update endpoint in the API
      console.log("Update ride:", editingRide.id, newRide);
      setEditingRide(null);
      setShowManualForm(false);
      await loadRides();
    } catch (err) {
      console.error("Failed to update ride:", err);
      setError("Failed to update ride");
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    if (!confirm("Are you sure you want to delete this ride?")) return;

    try {
      await xhrRidesAPI.deleteRide(rideId);
      await loadRides();
    } catch (err) {
      console.error("Failed to delete ride:", err);
      setError("Failed to delete ride");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Time",
      "Pickup",
      "Dropoff",
      "Type",
      "Earnings",
      "Tips",
      "Surge",
      "Duration (min)",
      "Distance (mi)",
      "Notes",
    ];

    const csvData = [
      headers.join(","),
      ...rides.map((ride) =>
        [
          ride.date,
          ride.time,
          `"${ride.pickup_location}"`,
          `"${ride.dropoff_location}"`,
          ride.ride_type,
          ride.earnings,
          ride.tips,
          ride.surge,
          ride.duration,
          ride.distance,
          `"${ride.notes}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uber-boost-rides-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredRides = rides.filter((ride) => {
    const rideDate = new Date(ride.date);
    const today = new Date();

    let dateMatch = true;
    if (dateFilter === "today") {
      dateMatch = rideDate.toDateString() === today.toDateString();
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      dateMatch = rideDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      dateMatch = rideDate >= monthAgo;
    }

    const typeMatch =
      rideTypeFilter === "all" || ride.ride_type === rideTypeFilter;

    return dateMatch && typeMatch;
  });

  const todayEarnings = filteredRides
    .filter((ride) => ride.date === new Date().toISOString().split("T")[0])
    .reduce((sum, ride) => sum + ride.earnings + ride.tips, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-ocean/5 to-florida-ocean/10">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-florida-ocean"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-florida-ocean">
                  Ride Logger
                </h1>
                <p className="text-sm text-muted-foreground">
                  Voice log your rides or enter them manually
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Today: ${todayEarnings.toFixed(2)}
              </Badge>
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                disabled={rides.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Log Section */}
          <div className="lg:col-span-1">
            <Card className="border-florida-ocean/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-florida-ocean" />
                  Quick Log
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voice Recording */}
                {voiceSupported && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <Button
                        onClick={
                          isRecording ? stopVoiceRecording : startVoiceRecording
                        }
                        disabled={isListening}
                        className={`w-24 h-24 rounded-full text-white ${
                          isRecording
                            ? "bg-red-500 hover:bg-red-600 animate-pulse"
                            : "bg-florida-ocean hover:bg-florida-ocean-dark"
                        }`}
                      >
                        {isRecording ? (
                          <StopCircle className="w-8 h-8" />
                        ) : (
                          <Mic className="w-8 h-8" />
                        )}
                      </Button>
                    </div>

                    {isListening && (
                      <div className="text-center text-sm text-muted-foreground">
                        Listening... Speak clearly
                      </div>
                    )}

                    {voiceTranscript && (
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        <strong>Heard:</strong> "{voiceTranscript}"
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground text-center">
                      Say: "From downtown to airport, UberX, twenty five
                      dollars"
                    </div>
                  </div>
                )}

                {!voiceSupported && (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Voice recognition not supported in this browser. Use
                      Chrome or Safari for voice features.
                    </p>
                  </div>
                )}

                {/* Quick Manual Entry */}
                <div className="space-y-3 pt-4 border-t">
                  <Label>Quick Manual Entry</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="From..."
                      value={newRide.pickup_location}
                      onChange={(e) =>
                        setNewRide((prev) => ({
                          ...prev,
                          pickup_location: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="To..."
                      value={newRide.dropoff_location}
                      onChange={(e) =>
                        setNewRide((prev) => ({
                          ...prev,
                          dropoff_location: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Earnings"
                      value={newRide.earnings || ""}
                      onChange={(e) =>
                        setNewRide((prev) => ({
                          ...prev,
                          earnings: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                    <Select
                      value={newRide.ride_type}
                      onValueChange={(value) =>
                        setNewRide((prev) => ({ ...prev, ride_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UberX">UberX</SelectItem>
                        <SelectItem value="Uber XL">Uber XL</SelectItem>
                        <SelectItem value="Uber Black">Uber Black</SelectItem>
                        <SelectItem value="Lyft">Lyft</SelectItem>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleQuickSave()}
                      disabled={
                        !newRide.pickup_location ||
                        !newRide.dropoff_location ||
                        !newRide.earnings
                      }
                      className="flex-1 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Quick Save
                    </Button>
                    <Button
                      onClick={() => setShowManualForm(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Detailed
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ride History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-florida-ocean" />
                    Recent Rides
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-florida-ocean border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading rides...</p>
                  </div>
                ) : filteredRides.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No rides logged yet</p>
                    <p className="text-sm text-muted-foreground">
                      Use voice logging or manual entry to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRides.map((ride) => (
                      <div
                        key={ride.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium">
                              {ride.pickup_location} → {ride.dropoff_location}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {ride.ride_type}
                            </Badge>
                            {ride.surge > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-orange-100 text-orange-800"
                              >
                                {ride.surge}x surge
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>
                              {ride.date} at {ride.time}
                            </span>
                            <span>${ride.earnings.toFixed(2)}</span>
                            {ride.tips > 0 && (
                              <span>+${ride.tips.toFixed(2)} tip</span>
                            )}
                            {ride.duration > 0 && (
                              <span>{ride.duration}min</span>
                            )}
                            {ride.distance > 0 && (
                              <span>{ride.distance}mi</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRide(ride)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRide(ride.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showManualForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingRide ? "Edit Ride" : "Log Ride Details"}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newRide.date}
                  onChange={(e) =>
                    setNewRide((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newRide.time}
                  onChange={(e) =>
                    setNewRide((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <Label htmlFor="pickup">Pickup Location</Label>
                <Input
                  id="pickup"
                  value={newRide.pickup_location}
                  onChange={(e) =>
                    setNewRide((prev) => ({
                      ...prev,
                      pickup_location: e.target.value,
                    }))
                  }
                  placeholder="Downtown, 123 Main St, Airport, etc."
                />
              </div>
              <div>
                <Label htmlFor="dropoff">Dropoff Location</Label>
                <Input
                  id="dropoff"
                  value={newRide.dropoff_location}
                  onChange={(e) =>
                    setNewRide((prev) => ({
                      ...prev,
                      dropoff_location: e.target.value,
                    }))
                  }
                  placeholder="Beach, Mall, Hotel, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="rideType">Ride Type</Label>
                <Select
                  value={newRide.ride_type}
                  onValueChange={(value) =>
                    setNewRide((prev) => ({ ...prev, ride_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UberX">UberX</SelectItem>
                    <SelectItem value="Uber XL">Uber XL</SelectItem>
                    <SelectItem value="Uber Black">Uber Black</SelectItem>
                    <SelectItem value="Uber Pool">Uber Pool</SelectItem>
                    <SelectItem value="Lyft">Lyft</SelectItem>
                    <SelectItem value="Lyft XL">Lyft XL</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select
                  value={newRide.vehicle_id}
                  onValueChange={(value) =>
                    setNewRide((prev) => ({ ...prev, vehicle_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="earnings">Earnings ($)</Label>
                <Input
                  id="earnings"
                  type="number"
                  step="0.01"
                  value={newRide.earnings || ""}
                  onChange={(e) =>
                    setNewRide((prev) => ({
                      ...prev,
                      earnings: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="tips">Tips ($)</Label>
                <Input
                  id="tips"
                  type="number"
                  step="0.01"
                  value={newRide.tips || ""}
                  onChange={(e) =>
                    setNewRide((prev) => ({
                      ...prev,
                      tips: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="surge">Surge Multiplier</Label>
                <Input
                  id="surge"
                  type="number"
                  step="0.1"
                  value={newRide.surge}
                  onChange={(e) =>
                    setNewRide((prev) => ({
                      ...prev,
                      surge: parseFloat(e.target.value) || 1.0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newRide.duration || ""}
                  onChange={(e) =>
                    setNewRide((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="distance">Distance (miles)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={newRide.distance || ""}
                  onChange={(e) =>
                    setNewRide((prev) => ({
                      ...prev,
                      distance: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newRide.notes}
                onChange={(e) =>
                  setNewRide((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any additional notes about this ride..."
                rows={3}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowManualForm(false);
                  setEditingRide(null);
                  setError(null);
                }}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={
                  editingRide ? handleUpdateRide : () => handleQuickSave()
                }
                disabled={
                  !newRide.pickup_location ||
                  !newRide.dropoff_location ||
                  !newRide.earnings
                }
                className="flex-1 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingRide ? "Update Ride" : "Save Ride"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
