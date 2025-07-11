import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Upload,
  FileText,
  Smartphone,
  Mic,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UberIntegration() {
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      title: "Request Your Uber Data",
      description: "Get your ride history from Uber's website",
      actions: [
        "Go to help.uber.com",
        "Sign in to your account",
        "Search for 'Download my data'",
        "Request your trip data",
        "Wait for email (2-3 days)",
      ],
      icon: Download,
      color: "florida-ocean",
    },
    {
      step: 2,
      title: "Import to Uber Boost",
      description: "Upload your CSV file to the app",
      actions: [
        "Download CSV from Uber email",
        "Open Uber Boost Ride Logger",
        "Click 'Import' button",
        "Select your CSV file",
        "Review imported rides",
      ],
      icon: Upload,
      color: "florida-palm",
    },
    {
      step: 3,
      title: "Manual Entry Options",
      description: "Quick ways to log rides manually",
      actions: [
        "Use voice dictation for speed",
        "Quick entry mode for basics",
        "Detailed mode for full data",
        "Export for backup",
      ],
      icon: Mic,
      color: "florida-sunset",
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
              onClick={() => navigate("/ride-logger")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Uber Integration
              </h1>
              <p className="text-xs text-muted-foreground">
                How to import your ride data
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Overview */}
        <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-ocean/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-florida-ocean" />
              Data Import Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-florida-ocean/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Download className="w-6 h-6 text-florida-ocean" />
                </div>
                <h3 className="font-semibold">Uber Export</h3>
                <p className="text-xs text-muted-foreground">
                  Official data from Uber
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-florida-palm/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Mic className="w-6 h-6 text-florida-palm" />
                </div>
                <h3 className="font-semibold">Voice Entry</h3>
                <p className="text-xs text-muted-foreground">
                  Quick speech-to-text
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-florida-sunset/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-florida-sunset" />
                </div>
                <h3 className="font-semibold">Manual Entry</h3>
                <p className="text-xs text-muted-foreground">
                  Detailed form input
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">
                  Uber API Limitation
                </h4>
                <p className="text-sm text-yellow-700">
                  Unfortunately, Uber doesn't provide a public API for drivers
                  to automatically sync ride data. We've built the best
                  alternatives: official data import and voice entry for speed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Guide */}
        {steps.map((step, index) => (
          <Card key={index} className={`border-${step.color}/20`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 bg-${step.color}/20 rounded-lg flex items-center justify-center`}
                  >
                    <step.icon className={`w-4 h-4 text-${step.color}`} />
                  </div>
                  Step {step.step}: {step.title}
                </span>
                <Badge className={`bg-${step.color} text-white`}>
                  {step.step === 1
                    ? "2-3 days"
                    : step.step === 2
                      ? "Instant"
                      : "Real-time"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <ol className="space-y-2">
                {step.actions.map((action, actionIndex) => (
                  <li key={actionIndex} className="flex items-start space-x-2">
                    <span
                      className={`w-5 h-5 bg-${step.color}/20 text-${step.color} rounded-full flex items-center justify-center text-xs font-semibold mt-0.5`}
                    >
                      {actionIndex + 1}
                    </span>
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ol>

              {step.step === 1 && (
                <Button
                  className="mt-4 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
                  onClick={() => window.open("https://help.uber.com", "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Uber Help
                </Button>
              )}

              {step.step === 2 && (
                <Button
                  className="mt-4 bg-florida-palm hover:bg-florida-palm/90 text-white"
                  onClick={() => navigate("/ride-logger")}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Open Ride Logger
                </Button>
              )}

              {step.step === 3 && (
                <Button
                  className="mt-4 bg-florida-sunset hover:bg-florida-sunset/90 text-white"
                  onClick={() => navigate("/ride-logger")}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Try Voice Entry
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {/* FAQ */}
        <Card className="border-florida-coral/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-florida-coral" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-florida-coral">
                Q: Can I get real-time data from Uber?
              </h4>
              <p className="text-sm text-muted-foreground">
                A: No, Uber doesn't provide real-time APIs for drivers. You'll
                need to use manual entry or periodic data exports.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-florida-coral">
                Q: How accurate is voice entry?
              </h4>
              <p className="text-sm text-muted-foreground">
                A: Voice recognition works well for structured phrases like
                "Downtown to airport, $25, 1.5x surge". Review before saving.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-florida-coral">
                Q: What format does CSV import expect?
              </h4>
              <p className="text-sm text-muted-foreground">
                A: Standard CSV with headers: date, time, pickup, dropoff, ride
                type, earnings, surge, duration, distance, tips.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-florida-coral">
                Q: Can I export my logged data?
              </h4>
              <p className="text-sm text-muted-foreground">
                A: Yes! Use the Export button in Ride Logger to download your
                data as CSV for backup or analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
