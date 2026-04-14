"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/cargo/navbar";
import { StatusBadge } from "@/components/cargo/status-badge";
import { RentalTimeline } from "@/components/cargo/rental-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { clientDashboardNavItems } from "@/lib/types";
import { mockRentalOrders, mockClients } from "@/lib/mock-data";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User,
  Phone,
  Mail,
  CreditCard,
  AlertTriangle,
  Car
} from "lucide-react";

const currentClient = mockClients[0];

export default function RentalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const rental = mockRentalOrders.find((r) => r.id === id);

  if (!rental) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar 
          navItems={clientDashboardNavItems} 
          isLoggedIn 
          userName={currentClient.firstName}
          userRole="CLIENT"
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Rental not found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const car = rental.car;
  const tariff = rental.tariff;
  const canCancel = ["CREATED", "CONFIRMED"].includes(rental.status);
  const isActive = rental.status === "ISSUED";

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        navItems={clientDashboardNavItems} 
        isLoggedIn 
        userName={currentClient.firstName}
        userRole="CLIENT"
      />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">Rental Details</h1>
              <StatusBadge status={rental.status} />
            </div>
            <p className="text-muted-foreground font-mono">Booking ID: {rental.id}</p>
          </div>
          {canCancel && (
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Info */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {car && (
                    <div className="relative w-full md:w-64 h-40 rounded-lg overflow-hidden bg-secondary/30 shrink-0">
                      <Image
                        src={car.imageUrl}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 text-primary border-primary/30">
                      {car?.carClass}
                    </Badge>
                    <h2 className="text-2xl font-bold text-foreground">
                      {car?.make} {car?.model}
                    </h2>
                    <p className="text-muted-foreground">{car?.year} | {car?.plateNumber}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {car?.features.slice(0, 4).map((feature) => (
                        <Badge key={feature} variant="secondary" className="bg-secondary/50">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Period */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Rental Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Pickup</p>
                    <p className="font-semibold text-foreground">
                      {new Date(rental.startDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {rental.pickupLocation}
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Return</p>
                    <p className="font-semibold text-foreground">
                      {new Date(rental.endDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {rental.returnLocation}
                    </div>
                  </div>
                </div>
                {rental.actualReturnDate && (
                  <div className="p-4 bg-cargo-success/10 rounded-lg border border-cargo-success/20">
                    <p className="text-sm text-muted-foreground mb-1">Actual Return</p>
                    <p className="font-semibold text-foreground">
                      {new Date(rental.actualReturnDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Rental Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <RentalTimeline 
                  history={rental.statusHistory} 
                  currentStatus={rental.status} 
                />
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            {canCancel && (
              <Card className="bg-cargo-warning/10 border-cargo-warning/20">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-cargo-warning shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">Cancellation Policy</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        You can cancel this booking for free until the vehicle is issued. 
                        Once the rental has started, cancellation is not possible.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Price & Client Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Summary */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Price Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base price</span>
                  <span className="text-foreground">${rental.basePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${tariff?.dailyPrice || 0}/day x {rental.totalDays} days
                  </span>
                  <span className="text-foreground">
                    ${(tariff?.dailyPrice || 0) * rental.totalDays}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tariff</span>
                  <span className="text-foreground">{tariff?.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary text-xl">${rental.totalPrice}</span>
                </div>
                <Badge variant="outline" className="w-full justify-center py-2 text-cargo-success border-cargo-success/30">
                  Paid
                </Badge>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">
                    {currentClient.firstName} {currentClient.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{currentClient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{currentClient.phone}</span>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">License Number</p>
                  <p className="font-mono text-foreground">{currentClient.licenseNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-6 text-center">
                <h4 className="font-semibold text-foreground mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available 24/7
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
