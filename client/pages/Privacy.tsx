import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  UserCheck,
  Database,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  const navigate = useNavigate();

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
                Privacy Policy
              </h1>
              <p className="text-xs text-muted-foreground">
                Your data privacy & security
              </p>
            </div>
          </div>
          <Shield className="w-6 h-6 text-florida-ocean" />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Privacy Overview */}
        <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-ocean/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-florida-ocean" />
              Privacy at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <Lock className="w-4 h-4" />
                <strong>Your Data is Secure</strong>
              </div>
              <p className="text-sm text-green-700 mt-1">
                All ride data is stored locally on your device. No personal
                information is sent to external servers.
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <Eye className="w-4 h-4" />
                <strong>No Tracking</strong>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                We don't track your location, rides, or earnings beyond what you
                voluntarily log in the app.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="border-florida-palm/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-florida-palm" />
              What Data We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-florida-palm mb-2">
                📱 Local Device Data
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Ride logs you manually enter</li>
                <li>• Earnings and tip information</li>
                <li>• Schedule preferences</li>
                <li>• App settings and preferences</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-florida-ocean mb-2">
                🌐 Anonymous Usage Data
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• App crashes and errors (no personal data)</li>
                <li>• Feature usage statistics (anonymous)</li>
                <li>• Performance metrics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">
                🚫 What We DON'T Collect
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Your real location or GPS data</li>
                <li>• Uber account information</li>
                <li>• Personal contact information</li>
                <li>• Banking or payment details</li>
                <li>• Photos or media files</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Voice Recognition Privacy */}
        <Card className="border-florida-sunset/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-florida-sunset" />
              Voice Recognition Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                When you use voice-to-text features in ride logging:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Voice processing happens locally on your device</li>
                <li>• No audio is recorded or stored permanently</li>
                <li>• Browser's built-in speech recognition is used</li>
                <li>• You can disable voice features anytime</li>
              </ul>
              <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> Browser speech recognition may send
                  audio to Google/Apple for processing. This is handled by your
                  browser, not our app.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="border-florida-coral/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-florida-coral" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-florida-coral mb-2">
                  Real-Time Data Sources
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  For surge predictions and market data, we may use:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Public traffic APIs (anonymous)</li>
                  <li>• Weather data services</li>
                  <li>• Event calendars (public data only)</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  These services don't receive any of your personal ride data or
                  earnings information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="border-florida-ocean/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-florida-ocean" />
              Your Rights & Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-florida-ocean/10 rounded-lg">
                <h4 className="font-semibold text-florida-ocean mb-1">
                  Export Your Data
                </h4>
                <p className="text-xs text-muted-foreground">
                  Export all your ride logs as CSV anytime
                </p>
              </div>
              <div className="p-3 bg-florida-palm/10 rounded-lg">
                <h4 className="font-semibold text-florida-palm mb-1">
                  Delete Your Data
                </h4>
                <p className="text-xs text-muted-foreground">
                  Clear all stored data from your device
                </p>
              </div>
              <div className="p-3 bg-florida-sunset/10 rounded-lg">
                <h4 className="font-semibold text-florida-sunset mb-1">
                  Control Features
                </h4>
                <p className="text-xs text-muted-foreground">
                  Disable voice, location, or other features
                </p>
              </div>
              <div className="p-3 bg-florida-coral/10 rounded-lg">
                <h4 className="font-semibold text-florida-coral mb-1">
                  Offline Mode
                </h4>
                <p className="text-xs text-muted-foreground">
                  Use the app completely offline
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-gray-200">
          <CardContent className="p-4 text-center">
            <h4 className="font-semibold mb-2">Questions About Privacy?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Contact our privacy team or review our full privacy policy
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                Full Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
