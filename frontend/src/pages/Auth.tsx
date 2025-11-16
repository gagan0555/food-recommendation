import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");
    
    if (token && user) {
      // User is logged in, redirect to home or profile
      navigate("/");
    }
  }, [navigate]);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://streetup.onrender.com";

  const handleAuth = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    let payload: any = {};

    if (type === "login") {
      payload = {
        email: (form.querySelector("#login-email") as HTMLInputElement).value,
        password: (form.querySelector("#login-password") as HTMLInputElement).value,
      };
    } else {
      payload = {
        name: (form.querySelector("#signup-name") as HTMLInputElement).value,
        email: (form.querySelector("#signup-email") as HTMLInputElement).value,
        password: (form.querySelector("#signup-password") as HTMLInputElement).value,
      };
    }

    try {
      const response = await fetch(`${baseUrl}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (type === "login") {
        if (data.token && data.user) {
          // Store token and user data
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("authUser", JSON.stringify(data.user));

          toast({
            title: "Success!",
            description: "You have been logged in successfully.",
          });

          // Redirect to home after login
          setTimeout(() => navigate("/"), 1500);
        }
      } else {
        // Auto login after signup
        toast({
          title: "Success!",
          description: "Account created successfully. Logging you in...",
        });

        // Login immediately after signup
        const loginResponse = await fetch(`${baseUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: payload.email, password: payload.password }),
        });
        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(loginData.error || "Login failed after signup.");
        }

        // Store token and user data
        localStorage.setItem("authToken", loginData.token);
        localStorage.setItem("authUser", JSON.stringify(loginData.user));

        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <Utensils className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Street Up Community</CardTitle>
          <CardDescription>Share and discover authentic food recommendations</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={(e) => handleAuth(e, "login")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={(e) => handleAuth(e, "signup")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;

