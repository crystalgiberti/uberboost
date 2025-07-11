import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function Login() {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    rememberMe: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        if (!formData.firstName || !formData.lastName) {
          throw new Error("First name and last name are required");
        }
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          city: formData.city || undefined,
        });
      } else {
        await login(formData.email, formData.password);
      }
    } catch (error: any) {
      setError(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Surge Prediction",
      description: "AI-powered fortune telling for earnings",
    },
    {
      icon: MapPin,
      title: "Smart Routing",
      description: "Navigate to the highest demand areas",
    },
    {
      icon: DollarSign,
      title: "Earnings Optimizer",
      description: "Maximize your daily income potential",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-florida-ocean to-florida-ocean-dark rounded-xl flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Uber Boost</h1>
            <p className="text-sm text-muted-foreground">by Eliv8</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Your Fortune Teller for Surge Pricing
        </h2>
        <p className="text-muted-foreground">
          Join thousands of Florida drivers earning 20% more
        </p>
      </header>

      {/* Features Preview */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-florida-ocean/20"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-florida-ocean/20 to-florida-ocean-dark/20 rounded-lg flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-florida-ocean" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login/Register Form */}
      <div className="flex-1 px-6">
        <Card className="border-florida-ocean/20 bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-foreground">
              {isRegistering ? "Create Your Account" : "Welcome Back"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isRegistering
                ? "Join the smart drivers community"
                : "Continue maximizing your earnings"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration fields */}
              {isRegistering && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="border-florida-ocean/30 focus:border-florida-ocean"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Driver"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="border-florida-ocean/30 focus:border-florida-ocean"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="border-florida-ocean/30 focus:border-florida-ocean"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City (Optional)</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Jacksonville"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="border-florida-ocean/30 focus:border-florida-ocean"
                    />
                  </div>
                </>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="driver@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-florida-ocean/30 focus:border-florida-ocean"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      isRegistering
                        ? "Create a strong password"
                        : "Enter your password"
                    }
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="border-florida-ocean/30 focus:border-florida-ocean pr-10"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {isRegistering && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              {/* Remember Me */}
              {!isRegistering && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      handleInputChange("rememberMe", checked as boolean)
                    }
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Keep me signed in
                  </Label>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-florida-ocean to-florida-ocean-dark hover:from-florida-ocean-dark hover:to-florida-ocean text-white font-semibold text-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isRegistering ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : isRegistering ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Switch between login/register */}
            <div className="text-center">
              <Button
                variant="ghost"
                className="text-sm text-florida-ocean"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                  setFormData((prev) => ({ ...prev, password: "" }));
                }}
              >
                {isRegistering
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </Button>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-2">
              {!isRegistering && (
                <Button variant="ghost" className="text-sm text-florida-ocean">
                  Forgot password?
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <span className="text-florida-ocean cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-florida-ocean cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
