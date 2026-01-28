import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  User,
  Edit,
  Save,
  X,
  Eye,
  Star,
  Crown,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Brain,
  Diamond,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "Jacksonville, FL",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "Jacksonville, FL",
    });
    setIsEditing(false);
  };

  const getMysticalLevel = () => {
    // Calculate mystical level based on profile completeness
    let level = 0;
    if (profileData.first_name) level += 20;
    if (profileData.last_name) level += 20;
    if (profileData.email) level += 20;
    if (profileData.phone) level += 20;
    if (profileData.city) level += 20;

    if (level >= 80) return { name: "Oracle Master", color: "text-purple-400" };
    if (level >= 60) return { name: "Sage Initiate", color: "text-blue-400" };
    if (level >= 40) return { name: "Wisdom Seeker", color: "text-green-400" };
    return { name: "New Disciple", color: "text-yellow-400" };
  };

  const getCosmicInsight = () => {
    const insights = [
      "The Oracle sees great potential within your aura",
      "Your profile resonates with cosmic prosperity energy",
      "The universe recognizes your dedication to the path",
      "Divine forces smile upon your journey to enlightenment",
      "Your spiritual driver profile attracts abundant rides",
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  };

  const mysticalLevel = getMysticalLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Mystical Header */}
      <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-purple-300 hover:text-white hover:bg-purple-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Oracle Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Sacred Profile
                  </h1>
                  <p className="text-sm text-purple-300">
                    Your divine identity in the Sage realm
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => logout()}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Oracle
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Avatar & Status */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-12 h-12" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-purple-300">
                        {profileData.first_name} {profileData.last_name}
                      </h2>
                      <Badge
                        className={`${mysticalLevel.color} bg-transparent border-current`}
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        {mysticalLevel.name}
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-black/30 rounded-lg">
                    <Eye className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-purple-300">
                      {getCosmicInsight()}
                    </p>
                  </div>

                  <Separator className="bg-purple-500/30" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-300">
                        {profileData.email}
                      </span>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">
                          {profileData.phone}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-300">
                        {profileData.city}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mystical Stats */}
            <Card className="mt-6 bg-black/40 border-purple-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-pink-400" />
                  <span className="text-pink-300">Oracle Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-purple-400">Wisdom Level:</span>
                    <span className="text-yellow-400 font-bold">Master</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Cosmic Alignment:</span>
                    <span className="text-green-400">97.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Divine Favor:</span>
                    <span className="text-purple-400">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Profile Power:</span>
                    <span className="text-blue-400">
                      {Math.round(
                        (Object.values(profileData).filter((v) => v).length /
                          Object.keys(profileData).length) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-purple-500/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-300">Sacred Information</span>
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Oracle Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-purple-300">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={profileData.first_name}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              first_name: e.target.value,
                            }))
                          }
                          className="bg-purple-900/50 border-purple-500/50 text-white"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-purple-300">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={profileData.last_name}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              last_name: e.target.value,
                            }))
                          }
                          className="bg-purple-900/50 border-purple-500/50 text-white"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-purple-300">
                        Sacred Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="bg-purple-900/50 border-purple-500/50 text-white"
                        placeholder="oracle@sage.app"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-purple-300">
                        Mystical Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="bg-purple-900/50 border-purple-500/50 text-white"
                        placeholder="(555) SAGE-APP"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-purple-300">
                        Sacred City
                      </Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="bg-purple-900/50 border-purple-500/50 text-white"
                        placeholder="Jacksonville, FL"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Blessing Profile...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Bless Changes
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        disabled={isLoading}
                        className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-purple-800/30 rounded-lg">
                        <Label className="text-purple-400 text-sm">
                          Oracle Name
                        </Label>
                        <p className="text-white text-lg font-medium">
                          {profileData.first_name} {profileData.last_name}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-800/30 rounded-lg">
                        <Label className="text-purple-400 text-sm">
                          Sacred Email
                        </Label>
                        <p className="text-white text-lg font-medium">
                          {profileData.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-purple-800/30 rounded-lg">
                        <Label className="text-purple-400 text-sm">
                          Mystical Phone
                        </Label>
                        <p className="text-white text-lg font-medium">
                          {profileData.phone || "Not set"}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-800/30 rounded-lg">
                        <Label className="text-purple-400 text-sm">
                          Sacred City
                        </Label>
                        <p className="text-white text-lg font-medium">
                          {profileData.city}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-700/30 to-blue-700/30 rounded-lg border border-purple-500/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Diamond className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-yellow-300">
                          Profile Blessing Status
                        </h3>
                      </div>
                      <p className="text-purple-300 text-sm mb-3">
                        Your profile resonates with{" "}
                        {Math.round(
                          (Object.values(profileData).filter((v) => v).length /
                            Object.keys(profileData).length) *
                            100,
                        )}
                        % cosmic energy. Complete all fields to unlock maximum
                        Oracle power.
                      </p>
                      <div className="w-full bg-purple-900/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(Object.values(profileData).filter((v) => v).length / Object.keys(profileData).length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Oracle Preferences */}
            <Card className="mt-6 bg-black/40 border-purple-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300">Oracle Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <div>
                      <p className="text-purple-300">
                        Daily Wisdom Notifications
                      </p>
                      <p className="text-xs text-purple-400">
                        Receive mystical insights for your driving success
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <div>
                      <p className="text-purple-300">Surge Prophecy Alerts</p>
                      <p className="text-xs text-purple-400">
                        Get notified when the Oracle predicts surge
                        opportunities
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <div>
                      <p className="text-purple-300">Cosmic Voice Guidance</p>
                      <p className="text-xs text-purple-400">
                        Enable mystical voice commands and audio wisdom
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
