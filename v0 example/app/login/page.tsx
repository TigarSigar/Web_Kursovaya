"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/cargo/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clientNavItems } from "@/lib/types";
import { Car, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent, role: "client" | "manager") => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (role === "client") {
      router.push("/dashboard");
    } else {
      router.push("/manager");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar navItems={clientNavItems} showAuth={false} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome to CarGO</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account</p>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <Tabs defaultValue="client" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/50 mb-6">
                  <TabsTrigger value="client">Client</TabsTrigger>
                  <TabsTrigger value="manager">Fleet Manager</TabsTrigger>
                </TabsList>

                <TabsContent value="client">
                  <form onSubmit={(e) => handleLogin(e, "client")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="client-email"
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10 bg-input border-border"
                          defaultValue="john.smith@email.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="client-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 bg-input border-border"
                          defaultValue="password123"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Link href="#" className="text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In as Client"}
                      {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </form>
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    {"Don't have an account? "}
                    <Link href="#" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="manager">
                  <form onSubmit={(e) => handleLogin(e, "manager")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manager-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="manager-email"
                          type="email"
                          placeholder="manager@cargo.com"
                          className="pl-10 bg-input border-border"
                          defaultValue="manager@cargo.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manager-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="manager-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 bg-input border-border"
                          defaultValue="manager123"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In as Manager"}
                      {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </form>
                  <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                      Fleet Manager access requires administrator approval
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Demo Links */}
          <div className="mt-8 p-4 bg-card/30 border border-border/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Quick access for demo:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-border" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Client Dashboard
                </Button>
              </Link>
              <Link href="/manager">
                <Button variant="outline" className="w-full border-border" size="sm">
                  <Car className="h-4 w-4 mr-2" />
                  Manager Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
