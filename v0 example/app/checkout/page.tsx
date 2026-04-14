"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/cargo/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientNavItems } from "@/lib/types";
import { mockCars, mockTariffs, locations } from "@/lib/mock-data";
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Calendar, 
  Shield,
  Check,
  Lock
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const carId = searchParams.get("carId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    pickupLocation: "",
    returnLocation: "",
    agreeTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const car = mockCars.find((c) => c.id === carId);
  const tariff = mockTariffs.find((t) => t.carClass === car?.carClass);

  if (!car || !startDate || !endDate || !tariff) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar navItems={clientNavItems} showAuth />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Invalid booking</h1>
          <p className="text-muted-foreground mb-6">Please select a car and dates first.</p>
          <Link href="/cars">
            <Button>Browse Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate pricing
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  let discount = 0;
  if (days >= 30) discount = tariff.monthlyDiscount;
  else if (days >= 7) discount = tariff.weeklyDiscount;

  const subtotal = tariff.basePrice + (tariff.dailyPrice * days);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar navItems={clientNavItems} showAuth />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto bg-card/50 border-border/50">
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cargo-success/20 mb-6">
                <Check className="h-10 w-10 text-cargo-success" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your reservation for {car.make} {car.model} has been confirmed. 
                You will receive a confirmation email shortly.
              </p>
              <div className="bg-secondary/30 rounded-lg p-6 mb-8 text-left max-w-sm mx-auto">
                <h3 className="font-semibold text-foreground mb-3">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="text-foreground font-mono">RNT-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="text-foreground">{car.make} {car.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup</span>
                    <span className="text-foreground">{new Date(startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Return</span>
                    <span className="text-foreground">{new Date(endDate).toLocaleDateString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total Paid</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90">
                    View My Rentals
                  </Button>
                </Link>
                <Link href="/cars">
                  <Button variant="outline">
                    Book Another Car
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar navItems={clientNavItems} showAuth />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href={`/cars/${car.id}?startDate=${startDate}&endDate=${endDate}`}>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Car Details
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">Complete Your Booking</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">Driver&apos;s License Number</Label>
                    <Input
                      id="license"
                      required
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="bg-input border-border"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pickup & Return */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Pickup & Return Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pickup Location</Label>
                      <Select
                        value={formData.pickupLocation}
                        onValueChange={(value) => setFormData({ ...formData, pickupLocation: value })}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Return Location</Label>
                      <Select
                        value={formData.returnLocation}
                        onValueChange={(value) => setFormData({ ...formData, returnLocation: value })}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeTerms: checked as boolean })
                      }
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                      I agree to the rental terms and conditions, including the cancellation policy. 
                      I understand that cancellation is not allowed after the vehicle has been issued.
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Car Summary */}
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-secondary/30">
                        <Image
                          src={car.imageUrl}
                          alt={`${car.make} ${car.model}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{car.make} {car.model}</h3>
                        <p className="text-sm text-muted-foreground">{car.carClass}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(startDate).toLocaleDateString()}</span>
                      </div>
                      <span>to</span>
                      <span>{new Date(endDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Price Summary */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle>Price Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base price</span>
                      <span className="text-foreground">${tariff.basePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${tariff.dailyPrice}/day x {days} days
                      </span>
                      <span className="text-foreground">${tariff.dailyPrice * days}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-cargo-success">
                        <span>Discount ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary text-xl">${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20 mt-4">
                      <Shield className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-xs text-foreground">Full insurance coverage included</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 mt-4"
                      size="lg"
                      disabled={isSubmitting || !formData.agreeTerms}
                    >
                      {isSubmitting ? (
                        "Processing..."
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Secure payment processing
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
