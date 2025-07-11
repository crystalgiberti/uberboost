import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  testApiConnection,
  simpleRegister,
  simpleLogin,
} from "../services/simpleApiService";

export default function Debug() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [firstName, setFirstName] = useState("Test");
  const [lastName, setLastName] = useState("User");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testPing = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ping");
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      const data = await response.text();
      setResult(`Status: ${response.status}\nResponse: ${data}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.text();
      setResult(`Status: ${response.status}\nResponse: ${data}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10 p-4">
      <Card>
        <CardHeader>
          <CardTitle>API Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={testPing} disabled={loading}>
              Test Ping
            </Button>
            <Button onClick={testRegister} disabled={loading}>
              Test Register
            </Button>
            <Button onClick={testLogin} disabled={loading}>
              Test Login
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">Result</Label>
            <Textarea
              id="result"
              value={result}
              onChange={() => {}}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <Button onClick={() => setResult("")} variant="outline">
            Clear Result
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
