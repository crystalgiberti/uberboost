import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  MapPin,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login with:", formData);
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

      {/* Login Form */}
      <div className="flex-1 px-6">
        <Card className="border-florida-ocean/20 bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-foreground">
              Start Your Trial
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              3-7 days free, then $9.99/month
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                type="button"
                variant={loginMethod === "email" ? "default" : "ghost"}
                className={`flex-1 h-10 ${
                  loginMethod === "email"
                    ? "bg-florida-ocean text-white"
                    : "text-muted-foreground"
                }`}
                onClick={() => setLoginMethod("email")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={loginMethod === "phone" ? "default" : "ghost"}
                className={`flex-1 h-10 ${
                  loginMethod === "phone"
                    ? "bg-florida-ocean text-white"
                    : "text-muted-foreground"
                }`}
                onClick={() => setLoginMethod("phone")}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Phone
              </Button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email/Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="contact">
                  {loginMethod === "email" ? "Email Address" : "Phone Number"}
                </Label>
                <Input
                  id="contact"
                  type={loginMethod === "email" ? "email" : "tel"}
                  placeholder={
                    loginMethod === "email"
                      ? "driver@example.com"
                      : "(555) 123-4567"
                  }
                  value={
                    loginMethod === "email" ? formData.email : formData.phone
                  }
                  onChange={(e) =>
                    handleInputChange(
                      loginMethod === "email" ? "email" : "phone",
                      e.target.value,
                    )
                  }
                  className="border-florida-ocean/30 focus:border-florida-ocean"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="border-florida-ocean/30 focus:border-florida-ocean pr-10"
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
              </div>

              {/* Remember Me */}
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-florida-ocean to-florida-ocean-dark hover:from-florida-ocean-dark hover:to-florida-ocean text-white font-semibold text-lg"
              >
                Start Free Trial
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 border-florida-ocean/30 hover:bg-florida-ocean/5"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="h-12 border-florida-ocean/30 hover:bg-florida-ocean/5"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                Apple
              </Button>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-2">
              <Button variant="ghost" className="text-sm text-florida-ocean">
                Forgot password?
              </Button>
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <span className="text-florida-ocean">Terms of Service</span> and{" "}
                <span className="text-florida-ocean">Privacy Policy</span>
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
