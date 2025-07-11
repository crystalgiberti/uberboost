import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Edit,
  Camera,
  Phone,
  Mail,
  MapPin,
  Car,
  Star,
  DollarSign,
  Calendar,
  Settings,
  LogOut,
  Shield,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Driver",
    email: "john.driver@email.com",
    phone: "(904) 555-0123",
    city: "Jacksonville",
    carMake: "Toyota",
    carModel: "Camry",
    carYear: "2020",
    licensePlate: "ABC-1234",
    uberRating: 4.87,
    totalTrips: 1247,
    memberSince: "January 2023",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // In real app, would save to backend
    setIsEditing(false);
    console.log("Saved profile data:", profileData);
  };

  const stats = [
    {
      icon: Star,
      label: "Uber Rating",
      value: profileData.uberRating.toFixed(2),
      color: "florida-sunset",
    },
    {
      icon: Car,
      label: "Total Trips",
      value: profileData.totalTrips.toLocaleString(),
      color: "florida-ocean",
    },
    {
      icon: DollarSign,
      label: "This Month",
      value: "$2,847",
      color: "florida-palm",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: profileData.memberSince,
      color: "florida-coral",
    },
  ];

  const menuItems = [
    {
      icon: Settings,
      label: "Account Settings",
      description: "Manage your account preferences",
      onClick: () => navigate("/settings"),
    },
    {
      icon: Bell,
      label: "Notification Preferences",
      description: "Control app notifications",
      onClick: () => navigate("/notifications"),
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      description: "Manage your privacy settings",
      onClick: () => navigate("/privacy"),
    },
    {
      icon: Car,
      label: "Vehicle Information",
      description: "Update your vehicle details",
      onClick: () => navigate("/vehicle"),
    },
  ];

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
              <h1 className="text-lg font-bold text-foreground">Profile</h1>
              <p className="text-xs text-muted-foreground">
                Manage your account
              </p>
            </div>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className={
              isEditing
                ? "bg-florida-ocean hover:bg-florida-ocean-dark text-white"
                : ""
            }
          >
            {isEditing ? "Save" : <Edit className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-ocean/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-florida-ocean text-white text-xl flex items-center justify-center font-bold">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-florida-ocean hover:bg-florida-ocean-dark text-white p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Uber Driver • {profileData.city}, FL
                    </p>
                  </div>
                  <Badge className="bg-florida-palm text-white">
                    Pro Driver
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {profileData.uberRating}
                  </span>
                  <span>{profileData.totalTrips} trips</span>
                  <span>Member since {profileData.memberSince}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className={`border-${stat.color}/20`}>
              <CardContent className="p-4 text-center">
                <stat.icon
                  className={`w-8 h-8 text-${stat.color} mx-auto mb-2`}
                />
                <div className={`text-2xl font-bold text-${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personal Information */}
        <Card className="border-florida-ocean/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-florida-ocean" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  disabled={!isEditing}
                  className="border-florida-ocean/30 focus:border-florida-ocean"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  disabled={!isEditing}
                  className="border-florida-ocean/30 focus:border-florida-ocean"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="border-florida-ocean/30 focus:border-florida-ocean"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  className="border-florida-ocean/30 focus:border-florida-ocean"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Primary City</Label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={!isEditing}
                  className="border-florida-ocean/30 focus:border-florida-ocean"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card className="border-florida-palm/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-florida-palm" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carMake">Make</Label>
                <Input
                  id="carMake"
                  value={profileData.carMake}
                  onChange={(e) => handleInputChange("carMake", e.target.value)}
                  disabled={!isEditing}
                  className="border-florida-palm/30 focus:border-florida-palm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carModel">Model</Label>
                <Input
                  id="carModel"
                  value={profileData.carModel}
                  onChange={(e) =>
                    handleInputChange("carModel", e.target.value)
                  }
                  disabled={!isEditing}
                  className="border-florida-palm/30 focus:border-florida-palm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carYear">Year</Label>
                <Input
                  id="carYear"
                  value={profileData.carYear}
                  onChange={(e) => handleInputChange("carYear", e.target.value)}
                  disabled={!isEditing}
                  className="border-florida-palm/30 focus:border-florida-palm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={profileData.licensePlate}
                  onChange={(e) =>
                    handleInputChange("licensePlate", e.target.value)
                  }
                  disabled={!isEditing}
                  className="border-florida-palm/30 focus:border-florida-palm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Menu */}
        <Card className="border-florida-sunset/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-florida-sunset" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 hover:bg-florida-sunset/10"
                  onClick={item.onClick}
                >
                  <item.icon className="w-5 h-5 text-florida-sunset mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Button>
                {index < menuItems.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="border-red-200">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                // In real app, would handle sign out
                navigate("/login");
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
