import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSafeAuth } from "../contexts/SafeAuthContext";

export default function AuthTest() {
  const { user, isLoading, login, register, logout, testConnection } =
    useSafeAuth();

  const [formData, setFormData] = useState({
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      await login(formData.email, formData.password);
      setMessage("✅ Login successful!");
    } catch (error: any) {
      setMessage(`❌ Login failed: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setMessage("✅ Registration successful!");
    } catch (error: any) {
      setMessage(`❌ Registration failed: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      await logout();
      setMessage("✅ Logout successful!");
    } catch (error: any) {
      setMessage(`❌ Logout failed: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  const handleTestConnection = async () => {
    setIsSubmitting(true);
    setMessage("Testing API connection...");
    try {
      const isConnected = await testConnection();
      setMessage(
        isConnected ? "✅ API connection working!" : "❌ API connection failed",
      );
    } catch (error: any) {
      setMessage(`❌ Connection test failed: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Safe Auth Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800">
                  ✅ Logged in as:
                </h3>
                <p className="text-green-700">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-green-600 text-sm">{user.email}</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700">Not logged in</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleTestConnection}
                disabled={isSubmitting}
                variant="outline"
              >
                Test API
              </Button>
              <Button
                onClick={handleRegister}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Register
              </Button>
              <Button
                onClick={handleLogin}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
              <Button
                onClick={handleLogout}
                disabled={isSubmitting}
                variant="destructive"
              >
                Logout
              </Button>
            </div>

            {isSubmitting && (
              <div className="flex items-center justify-center py-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
