"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/cargo/navbar";
import { StatusBadge } from "@/components/cargo/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { clientNavItems } from "@/lib/types";
import { mockCars, mockTariffs } from "@/lib/mock-data";
import { 
  ArrowLeft, 
  Users, 
  Fuel, 
  Settings2, 
  Calendar, 
  Shield, 
  Gauge,
  Check,
  Info,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const car = mockCars.find((c) => c.id === id);
  const tariff = mockTariffs.find((t) => t.carClass === car?.carClass);

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar navItems={clientNavItems} showAuth />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Car not found</h1>
          <Link href="/cars">
            <Button>Back to Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = car.status === "AVAILABLE";

  // Calculate rental price
  const calculatePrice = () => {
    if (!startDate || !endDate || !tariff) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return null;
    
    let discount = 0;
    if (days >= 30) discount = tariff.monthlyDiscount;
    else if (days >= 7) discount = tariff.weeklyDiscount;

    const subtotal = tariff.basePrice + (tariff.dailyPrice * days);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    return { days, subtotal, discount, discountAmount, total };
  };

  const pricing = calculatePrice();

  const handleBookNow = () => {
    if (!pricing) return;
    const params = new URLSearchParams({
      carId: car.id,
      startDate,
      endDate,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar navItems={clientNavItems} showAuth />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/cars">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Image */}
            <Card className="bg-card/50 border-border/50 overflow-hidden">
              <div className="relative aspect-video bg-secondary/30">
                <Image
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <StatusBadge status={car.status} />
                </div>
              </div>
            </Card>

            {/* Car Info */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <Badge variant="outline" className="mb-2 text-primary border-primary/30">
                      {car.carClass}
                    </Badge>
                    <h1 className="text-3xl font-bold text-foreground">
                      {car.make} {car.model}
                    </h1>
                    <p className="text-muted-foreground mt-1">{car.year} | {car.plateNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-foreground">${car.dailyRate}</p>
                    <p className="text-sm text-muted-foreground">per day</p>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-border">
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Seats</p>
                    <p className="font-semibold text-foreground">{car.seats}</p>
                  </div>
                  <div className="text-center">
                    <Settings2 className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-semibold text-foreground">{car.transmission}</p>
                  </div>
                  <div className="text-center">
                    <Fuel className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Fuel Type</p>
                    <p className="font-semibold text-foreground">{car.fuelType}</p>
                  </div>
                  <div className="text-center">
                    <Gauge className="h-5 w-5 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">VIN</p>
                    <p className="font-semibold text-foreground text-xs">{car.vin.slice(-8)}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-4">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="bg-secondary/50">
                        <Check className="h-3 w-3 mr-1 text-primary" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tariff Details */}
            {tariff && (
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Rental Conditions - {tariff.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{tariff.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Daily Rate</p>
                      <p className="text-lg font-semibold text-foreground">${tariff.dailyPrice}/day</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Base Price</p>
                      <p className="text-lg font-semibold text-foreground">${tariff.basePrice}</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Weekly Discount</p>
                      <p className="text-lg font-semibold text-foreground">{tariff.weeklyDiscount}%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Discount</p>
                      <p className="text-lg font-semibold text-foreground">{tariff.monthlyDiscount}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">
                      {tariff.insuranceIncluded ? "Full insurance coverage included" : "Insurance available as add-on"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Mileage limit: {tariff.mileageLimit} km/day</p>
                    <p>Extra mileage: ${tariff.extraMileageCost}/km</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className={cn(
                "bg-card/50 border-border/50",
                !isAvailable && "opacity-75"
              )}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book This Car</span>
                    {!isAvailable && (
                      <Badge variant="secondary" className="bg-muted">
                        Unavailable
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={!isAvailable}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Return Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={!isAvailable}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  {pricing ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base price</span>
                        <span className="text-foreground">${tariff?.basePrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${tariff?.dailyPrice}/day x {pricing.days} days
                        </span>
                        <span className="text-foreground">
                          ${tariff ? tariff.dailyPrice * pricing.days : 0}
                        </span>
                      </div>
                      {pricing.discount > 0 && (
                        <div className="flex justify-between text-sm text-cargo-success">
                          <span>Discount ({pricing.discount}%)</span>
                          <span>-${pricing.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span className="text-foreground">Total</span>
                        <span className="text-primary text-xl">${pricing.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Select dates to see pricing
                    </p>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    size="lg"
                    disabled={!isAvailable || !pricing}
                    onClick={handleBookNow}
                  >
                    {isAvailable ? "Continue to Checkout" : "Car Unavailable"}
                  </Button>

                  {isAvailable && (
                    <p className="text-xs text-muted-foreground text-center">
                      Free cancellation before pickup
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
