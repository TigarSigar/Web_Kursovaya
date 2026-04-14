"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/cargo/navbar";
import { StatCard } from "@/components/cargo/stat-card";
import { StatusBadge } from "@/components/cargo/status-badge";
import { RentalTimeline } from "@/components/cargo/rental-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { clientDashboardNavItems, type RentalOrder } from "@/lib/types";
import { mockRentalOrders, mockClients } from "@/lib/mock-data";
import { 
  Car, 
  Calendar, 
  Clock, 
  CheckCircle,
  XCircle,
  ArrowRight,
  MapPin,
  AlertTriangle
} from "lucide-react";

// Simulate current user
const currentClient = mockClients[0];
const userRentals = mockRentalOrders.filter(r => r.clientId === currentClient.id);

const activeRentals = userRentals.filter(r => r.status === "ISSUED");
const upcomingRentals = userRentals.filter(r => ["CREATED", "CONFIRMED"].includes(r.status));
const completedRentals = userRentals.filter(r => r.status === "COMPLETED");
const cancelledRentals = userRentals.filter(r => r.status === "CANCELLED");

function RentalCard({ rental, showActions = true }: { rental: RentalOrder; showActions?: boolean }) {
  const car = rental.car;
  const canCancel = ["CREATED", "CONFIRMED"].includes(rental.status);
  
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Car Image */}
          {car && (
            <div className="relative w-full md:w-40 h-28 rounded-lg overflow-hidden bg-secondary/30 shrink-0">
              <Image
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Rental Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  {car?.make} {car?.model}
                </h3>
                <p className="text-sm text-muted-foreground">{car?.carClass}</p>
              </div>
              <StatusBadge status={rental.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{rental.pickupLocation}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Total: </span>
                <span className="text-lg font-bold text-foreground">${rental.totalPrice}</span>
                <span className="text-sm text-muted-foreground"> ({rental.totalDays} days)</span>
              </div>
              
              {showActions && (
                <div className="flex gap-2">
                  <Link href={`/dashboard/rentals/${rental.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {canCancel && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      Cancel
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClientDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        navItems={clientDashboardNavItems} 
        showAuth 
        isLoggedIn 
        userName={currentClient.firstName}
        userRole="CLIENT"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {currentClient.firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your rentals and bookings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Rentals"
            value={activeRentals.length}
            icon={Car}
            variant="success"
          />
          <StatCard
            title="Upcoming"
            value={upcomingRentals.length}
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            title="Completed"
            value={completedRentals.length}
            icon={CheckCircle}
            variant="default"
          />
          <StatCard
            title="Total Rentals"
            value={currentClient.totalRentals}
            icon={Clock}
            variant="default"
          />
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-primary/20 via-card to-primary/10 border-primary/20 mb-8">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Need a car?</h3>
                <p className="text-sm text-muted-foreground">Browse our premium fleet and book your next ride</p>
              </div>
              <Link href="/cars">
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                  Browse Cars
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Active Rental Alert */}
        {activeRentals.length > 0 && (
          <Card className="bg-cargo-success/10 border-cargo-success/20 mb-8">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cargo-success/20">
                  <Car className="h-5 w-5 text-cargo-success" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">You have an active rental</h4>
                  <p className="text-sm text-muted-foreground">
                    {activeRentals[0].car?.make} {activeRentals[0].car?.model} - Return by {new Date(activeRentals[0].endDate).toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/dashboard/rentals/${activeRentals[0].id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rentals Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-border">
            <TabsTrigger value="all">All Rentals</TabsTrigger>
            <TabsTrigger value="active">
              Active
              {activeRentals.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-cargo-success/20 text-cargo-success">
                  {activeRentals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming
              {upcomingRentals.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                  {upcomingRentals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {userRentals.length > 0 ? (
              userRentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeRentals.length > 0 ? (
              activeRentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))
            ) : (
              <EmptyState message="No active rentals" />
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingRentals.length > 0 ? (
              upcomingRentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))
            ) : (
              <EmptyState message="No upcoming rentals" />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedRentals.length > 0 ? (
              completedRentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} showActions={false} />
              ))
            ) : (
              <EmptyState message="No completed rentals" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({ message = "No rentals found" }: { message?: string }) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
          <Car className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{message}</h3>
        <p className="text-muted-foreground mb-4">
          Ready for your next adventure?
        </p>
        <Link href="/cars">
          <Button>Browse Cars</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
