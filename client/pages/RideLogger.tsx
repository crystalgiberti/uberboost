import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Mic,
  MicOff,
  Upload,
  Download,
  Car,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Navigation,
  FileText,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  pickupLocation: string;
  dropoffLocation: string;
  rideType: "UberX" | "UberXL" | "Uber Pool" | "Uber Black";
  earnings: number;
  surge: number;
  duration: number; // minutes
  distance: number; // miles
  tips: number;
  notes?: string;
  source: "manual" | "voice" | "import";
}

export default function RideLogger() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [rides, setRides] = useState<Ride[]>([]);
  const [currentRide, setCurrentRide] = useState<Partial<Ride>>({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    rideType: "UberX",
    surge: 1.0,
    tips: 0,
    source: "manual",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech recognition state
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");

  // Initialize speech recognition
  useEffect(() => {
    const checkSpeechSupport = () => {
      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        setSpeechSupported(true);
        const SpeechRecognition =
          (window as any).webkitSpeechRecognition ||
          (window as any).SpeechRecognition;

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => {
          setSpeechError(null);
          console.log("Speech recognition started");
        };

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          let interim = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interim += transcript;
            }
          }

          setInterimTranscript(interim);

          if (finalTranscript) {
            setTranscript((prev) => prev + " " + finalTranscript);
            parseVoiceInput(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          let errorMessage = "Speech recognition error";

          switch (event.error) {
            case "no-speech":
              errorMessage = "No speech detected. Please try speaking louder.";
              break;
            case "audio-capture":
              errorMessage =
                "Microphone not accessible. Please check permissions.";
              break;
            case "not-allowed":
              errorMessage =
                "Microphone access denied. Please allow microphone permissions.";
              break;
            case "network":
              errorMessage =
                "Network error. Please check your internet connection.";
              break;
            case "service-not-allowed":
              errorMessage = "Speech service not allowed. Please try again.";
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }

          setSpeechError(errorMessage);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          setInterimTranscript("");
        };
      } else {
        setSpeechSupported(false);
        setSpeechError(
          "Speech recognition not supported in this browser. Please use Chrome or Safari.",
        );
      }
    };

    checkSpeechSupport();
  }, []);

  const parseVoiceInput = (text: string) => {
    const lowerText = text.toLowerCase();
    const updates: Partial<Ride> = {};

    // Helper function to convert spoken numbers to digits
    const convertSpokenNumbers = (text: string) => {
      const numberWords: { [key: string]: string } = {
        zero: "0",
        one: "1",
        two: "2",
        three: "3",
        four: "4",
        five: "5",
        six: "6",
        seven: "7",
        eight: "8",
        nine: "9",
        ten: "10",
        eleven: "11",
        twelve: "12",
        thirteen: "13",
        fourteen: "14",
        fifteen: "15",
        sixteen: "16",
        seventeen: "17",
        eighteen: "18",
        nineteen: "19",
        twenty: "20",
        thirty: "30",
        forty: "40",
        fifty: "50",
        sixty: "60",
        seventy: "70",
        eighty: "80",
        ninety: "90",
      };

      let result = text;
      Object.entries(numberWords).forEach(([word, digit]) => {
        result = result.replace(new RegExp(`\\b${word}\\b`, "g"), digit);
      });

      // Handle compound numbers like "twenty five"
      result = result.replace(/(\d+)\s+(\d+)/g, (match, tens, ones) => {
        const tensNum = parseInt(tens);
        const onesNum = parseInt(ones);
        if (tensNum >= 20 && tensNum <= 90 && onesNum <= 9) {
          return (tensNum + onesNum).toString();
        }
        return match;
      });

      return result;
    };

    const processedText = convertSpokenNumbers(lowerText);

    // Parse earnings - handle multiple formats
    const earningsPatterns = [
      /(?:earned?|made?|got|received?)\s*\$?(\d+(?:\.\d{2})?)/,
      /\$(\d+(?:\.\d{2})?)/,
      /(\d+(?:\.\d{2})?)\s*dollars?/,
      /(\d+(?:\.\d{2})?)\s*bucks?/,
    ];

    for (const pattern of earningsPatterns) {
      const match = processedText.match(pattern);
      if (match) {
        updates.earnings = parseFloat(match[1]);
        break;
      }
    }

    // Parse surge - handle multiple formats
    const surgePatterns = [
      /(\d+(?:\.\d)?)\s*(?:x|times?)\s*surge/,
      /surge\s*(?:of\s*)?(\d+(?:\.\d)?)/,
      /(\d+(?:\.\d)?)\s*(?:x|times?)\s*multiplier/,
      /multiplier\s*(?:of\s*)?(\d+(?:\.\d)?)/,
    ];

    for (const pattern of surgePatterns) {
      const match = processedText.match(pattern);
      if (match) {
        updates.surge = parseFloat(match[1]);
        break;
      }
    }

    // Parse ride type with more variations
    if (processedText.match(/uber\s*x(?:\s|$)/)) {
      updates.rideType = "UberX";
    } else if (processedText.match(/uber\s*xl|xl/)) {
      updates.rideType = "UberXL";
    } else if (processedText.match(/pool|shared/)) {
      updates.rideType = "Uber Pool";
    } else if (processedText.match(/black|premium|luxury/)) {
      updates.rideType = "Uber Black";
    }

    // Parse tips - handle multiple formats
    const tipPatterns = [
      /tip\s*(?:of\s*)?\$?(\d+(?:\.\d{2})?)/,
      /tipped\s*\$?(\d+(?:\.\d{2})?)/,
      /(\d+(?:\.\d{2})?)\s*(?:dollar|buck)s?\s*tip/,
      /gratuity\s*(?:of\s*)?\$?(\d+(?:\.\d{2})?)/,
    ];

    for (const pattern of tipPatterns) {
      const match = processedText.match(pattern);
      if (match) {
        updates.tips = parseFloat(match[1]);
        break;
      }
    }

    // Parse duration - handle multiple formats
    const durationPatterns = [
      /(\d+)\s*minutes?/,
      /took\s*(\d+)\s*minutes?/,
      /duration\s*(?:of\s*)?(\d+)\s*minutes?/,
      /(\d+)\s*mins?/,
      /lasted\s*(\d+)\s*minutes?/,
    ];

    for (const pattern of durationPatterns) {
      const match = processedText.match(pattern);
      if (match) {
        updates.duration = parseInt(match[1]);
        break;
      }
    }

    // Parse distance - handle multiple formats
    const distancePatterns = [
      /(\d+(?:\.\d)?)\s*miles?/,
      /distance\s*(?:of\s*)?(\d+(?:\.\d)?)\s*miles?/,
      /(\d+(?:\.\d)?)\s*mi/,
      /drove\s*(\d+(?:\.\d)?)\s*miles?/,
    ];

    for (const pattern of distancePatterns) {
      const match = processedText.match(pattern);
      if (match) {
        updates.distance = parseFloat(match[1]);
        break;
      }
    }

    // Parse locations with better handling
    const locationPatterns = [
      {
        pickup:
          /(?:from|starting\s*(?:at|from))\s*([^,]+?)(?:\s*to\s*|\s*,\s*(?:to\s*)?)/i,
        dropoff: /(?:to|ending\s*(?:at|in)|destination)\s*([^,]+?)(?:\s*,|$)/i,
      },
      {
        pickup: /pickup\s*(?:at|from)?\s*([^,]+?)(?:\s*,|$)/i,
        dropoff: /(?:drop\s*off|dropoff)\s*(?:at|to)?\s*([^,]+?)(?:\s*,|$)/i,
      },
    ];

    // Try the "from X to Y" pattern first
    if (
      text.toLowerCase().includes("from") &&
      text.toLowerCase().includes("to")
    ) {
      const fromIndex = lowerText.indexOf("from");
      const toIndex = lowerText.lastIndexOf("to");
      if (fromIndex < toIndex) {
        const pickup = text
          .substring(fromIndex + 4, toIndex)
          .trim()
          .replace(/[,.]$/, "")
          .trim();
        const dropoff = text
          .substring(toIndex + 2)
          .trim()
          .replace(/[,.]$/, "")
          .trim()
          .split(/[,.]|uber|dollar|surge|tip|minute|mile/i)[0]
          .trim();

        if (pickup) updates.pickupLocation = pickup;
        if (dropoff) updates.dropoffLocation = dropoff;
      }
    } else {
      // Try other patterns
      for (const patterns of locationPatterns) {
        const pickupMatch = text.match(patterns.pickup);
        const dropoffMatch = text.match(patterns.dropoff);

        if (pickupMatch && pickupMatch[1].trim()) {
          updates.pickupLocation = pickupMatch[1].trim().replace(/[,.]$/, "");
        }
        if (dropoffMatch && dropoffMatch[1].trim()) {
          updates.dropoffLocation = dropoffMatch[1].trim().replace(/[,.]$/, "");
        }

        if (pickupMatch || dropoffMatch) break;
      }
    }

    updates.source = "voice";

    // Show what was parsed
    const parsedFields = Object.keys(updates).filter(
      (key) => key !== "source" && updates[key as keyof Ride],
    );
    if (parsedFields.length > 0) {
      console.log("Parsed from voice:", updates);
    }

    setCurrentRide((prev) => ({ ...prev, ...updates }));
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const saveRide = () => {
    if (!currentRide.pickupLocation || !currentRide.dropoffLocation) {
      alert("Please fill in pickup and dropoff locations");
      return;
    }

    const newRide: Ride = {
      id: Date.now().toString(),
      date: currentRide.date || new Date().toISOString().split("T")[0],
      time: currentRide.time || new Date().toTimeString().slice(0, 5),
      pickupLocation: currentRide.pickupLocation || "",
      dropoffLocation: currentRide.dropoffLocation || "",
      rideType: currentRide.rideType || "UberX",
      earnings: currentRide.earnings || 0,
      surge: currentRide.surge || 1.0,
      duration: currentRide.duration || 0,
      distance: currentRide.distance || 0,
      tips: currentRide.tips || 0,
      notes: currentRide.notes,
      source: currentRide.source || "manual",
    };

    setRides((prev) => [newRide, ...prev]);
    setCurrentRide({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      rideType: "UberX",
      surge: 1.0,
      tips: 0,
      source: "manual",
    });
    setIsEditing(false);
    setTranscript("");
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split("\n");
      const headers = lines[0].toLowerCase().split(",");

      const importedRides: Ride[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length < headers.length) continue;

        const ride: Ride = {
          id: Date.now().toString() + i,
          date: values[headers.indexOf("date")] || "",
          time: values[headers.indexOf("time")] || "",
          pickupLocation:
            values[headers.indexOf("pickup")] ||
            values[headers.indexOf("pickup location")] ||
            "",
          dropoffLocation:
            values[headers.indexOf("dropoff")] ||
            values[headers.indexOf("dropoff location")] ||
            "",
          rideType: (values[headers.indexOf("ride type")] ||
            "UberX") as Ride["rideType"],
          earnings: parseFloat(values[headers.indexOf("earnings")]) || 0,
          surge: parseFloat(values[headers.indexOf("surge")]) || 1.0,
          duration: parseInt(values[headers.indexOf("duration")]) || 0,
          distance: parseFloat(values[headers.indexOf("distance")]) || 0,
          tips: parseFloat(values[headers.indexOf("tips")]) || 0,
          notes: values[headers.indexOf("notes")] || "",
          source: "import",
        };
        importedRides.push(ride);
      }

      setRides((prev) => [...importedRides, ...prev]);
      alert(`Imported ${importedRides.length} rides successfully!`);
    };
    reader.readAsText(file);
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Time",
      "Pickup Location",
      "Dropoff Location",
      "Ride Type",
      "Earnings",
      "Surge",
      "Duration",
      "Distance",
      "Tips",
      "Notes",
      "Source",
    ];
    const csvContent = [
      headers.join(","),
      ...rides.map((ride) =>
        [
          ride.date,
          ride.time,
          ride.pickupLocation,
          ride.dropoffLocation,
          ride.rideType,
          ride.earnings,
          ride.surge,
          ride.duration,
          ride.distance,
          ride.tips,
          ride.notes || "",
          ride.source,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uber-rides-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalEarnings = rides.reduce((sum, ride) => sum + ride.earnings, 0);
  const totalTips = rides.reduce((sum, ride) => sum + ride.tips, 0);
  const avgSurge =
    rides.length > 0
      ? rides.reduce((sum, ride) => sum + ride.surge, 0) / rides.length
      : 0;

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
              <h1 className="text-lg font-bold text-foreground">Ride Logger</h1>
              <p className="text-xs text-muted-foreground">
                Track your Uber rides
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-florida-ocean/20">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-6 h-6 text-florida-ocean mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-ocean">
                ${totalEarnings.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Total Earnings
              </div>
            </CardContent>
          </Card>
          <Card className="border-florida-palm/20">
            <CardContent className="p-3 text-center">
              <Car className="w-6 h-6 text-florida-palm mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-palm">
                {rides.length}
              </div>
              <div className="text-xs text-muted-foreground">Total Rides</div>
            </CardContent>
          </Card>
          <Card className="border-florida-sunset/20">
            <CardContent className="p-3 text-center">
              <Navigation className="w-6 h-6 text-florida-sunset mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-sunset">
                {avgSurge.toFixed(1)}x
              </div>
              <div className="text-xs text-muted-foreground">Avg Surge</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Entry Form */}
        <Card className="border-florida-ocean/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-florida-ocean" />
                {isEditing ? "Log New Ride" : "Quick Entry"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Quick" : "Detailed"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Voice Input */}
            <div className="p-4 bg-florida-sky/20 rounded-lg border border-florida-sky/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-florida-ocean">
                  🎤 Voice Entry
                </span>
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!speechSupported}
                  className={
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : speechSupported
                        ? "bg-florida-ocean hover:bg-florida-ocean-dark"
                        : "bg-gray-400 cursor-not-allowed"
                  }
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4 mr-1" />
                  ) : (
                    <Mic className="w-4 h-4 mr-1" />
                  )}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              </div>

              {speechSupported ? (
                <>
                  <p className="text-xs text-muted-foreground mb-2">
                    📝 Try saying: "From downtown to airport, UberX, twenty five
                    dollars, one point five times surge, twenty minutes, five
                    dollar tip"
                  </p>
                  <div className="space-y-2">
                    {speechError && (
                      <div className="text-sm bg-red-50 border border-red-200 text-red-700 p-2 rounded">
                        <strong>Error:</strong> {speechError}
                        <Button
                          variant="link"
                          size="sm"
                          className="ml-2 h-auto p-0 text-red-700"
                          onClick={() => setSpeechError(null)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}

                    {isRecording && (
                      <div className="text-sm bg-green-50 border border-green-200 text-green-700 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <strong>Listening...</strong>
                        </div>
                        {interimTranscript && (
                          <div className="mt-1 text-gray-600 italic">
                            "{interimTranscript}"
                          </div>
                        )}
                      </div>
                    )}

                    {transcript && (
                      <div className="text-sm bg-white p-2 rounded border">
                        <strong>Captured:</strong> {transcript}
                        <Button
                          variant="link"
                          size="sm"
                          className="ml-2 h-auto p-0"
                          onClick={() => setTranscript("")}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm bg-orange-50 border border-orange-200 text-orange-700 p-2 rounded">
                  <strong>⚠️ Voice Recognition Not Available</strong>
                  <p className="text-xs mt-1">
                    {speechError ||
                      "Please use Chrome, Safari, or Edge browser for voice features."}
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={currentRide.date}
                  onChange={(e) =>
                    setCurrentRide((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={currentRide.time}
                  onChange={(e) =>
                    setCurrentRide((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input
                id="pickup"
                placeholder="e.g., Downtown Jacksonville"
                value={currentRide.pickupLocation || ""}
                onChange={(e) =>
                  setCurrentRide((prev) => ({
                    ...prev,
                    pickupLocation: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoff">Dropoff Location</Label>
              <Input
                id="dropoff"
                placeholder="e.g., Jacksonville Airport"
                value={currentRide.dropoffLocation || ""}
                onChange={(e) =>
                  setCurrentRide((prev) => ({
                    ...prev,
                    dropoffLocation: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rideType">Ride Type</Label>
                <Select
                  value={currentRide.rideType}
                  onValueChange={(value: Ride["rideType"]) =>
                    setCurrentRide((prev) => ({ ...prev, rideType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UberX">UberX</SelectItem>
                    <SelectItem value="UberXL">UberXL</SelectItem>
                    <SelectItem value="Uber Pool">Uber Pool</SelectItem>
                    <SelectItem value="Uber Black">Uber Black</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="earnings">Earnings ($)</Label>
                <Input
                  id="earnings"
                  type="number"
                  step="0.01"
                  placeholder="25.50"
                  value={currentRide.earnings || ""}
                  onChange={(e) =>
                    setCurrentRide((prev) => ({
                      ...prev,
                      earnings: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            {isEditing && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="surge">Surge (x)</Label>
                    <Input
                      id="surge"
                      type="number"
                      step="0.1"
                      placeholder="1.5"
                      value={currentRide.surge || ""}
                      onChange={(e) =>
                        setCurrentRide((prev) => ({
                          ...prev,
                          surge: parseFloat(e.target.value) || 1.0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="20"
                      value={currentRide.duration || ""}
                      onChange={(e) =>
                        setCurrentRide((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (mi)</Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      placeholder="8.5"
                      value={currentRide.distance || ""}
                      onChange={(e) =>
                        setCurrentRide((prev) => ({
                          ...prev,
                          distance: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tips">Tips ($)</Label>
                  <Input
                    id="tips"
                    type="number"
                    step="0.01"
                    placeholder="5.00"
                    value={currentRide.tips || ""}
                    onChange={(e) =>
                      setCurrentRide((prev) => ({
                        ...prev,
                        tips: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about this ride..."
                    value={currentRide.notes || ""}
                    onChange={(e) =>
                      setCurrentRide((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>
              </>
            )}

            <Button
              onClick={saveRide}
              className="w-full bg-florida-ocean hover:bg-florida-ocean-dark text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Ride
            </Button>
          </CardContent>
        </Card>

        {/* Recent Rides */}
        <Card className="border-florida-sunset/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-florida-sunset" />
              Recent Rides ({rides.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rides.slice(0, 10).map((ride) => (
              <div
                key={ride.id}
                className="p-3 bg-white/50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {ride.pickupLocation} → {ride.dropoffLocation}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs border-florida-ocean text-florida-ocean"
                      >
                        {ride.rideType}
                      </Badge>
                      {ride.surge > 1.0 && (
                        <Badge className="bg-florida-coral text-white text-xs">
                          {ride.surge}x
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {ride.date} {ride.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ride.duration}min
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {ride.distance}mi
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-florida-ocean">
                      ${(ride.earnings + ride.tips).toFixed(2)}
                    </div>
                    {ride.tips > 0 && (
                      <div className="text-xs text-green-600">
                        +${ride.tips} tip
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {ride.source === "voice" && "🎤 "}
                      {ride.source === "import" && "📁 "}
                      {ride.source === "manual" && "✏️ "}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {rides.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No rides logged yet. Start by adding your first ride!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden file input for CSV import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={importFromCSV}
      />
    </div>
  );
}
