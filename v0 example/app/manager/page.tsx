"use client";

import Link from "next/link";
import { StatCard } from "@/components/cargo/stat-card";
import { StatusBadge } from "@/components/cargo/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  mockDashboardStats, 
  mockRentalOrders, 
  mockMaintenanceWindows,
  mockCars 
} from "@/lib/mock-data";
import { 
  Car, 
  CheckCircle, 
  Clock, 
  Wrench,
  DollarSign,
  ClipboardList,
  ArrowRight,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

export default function ManagerDashboardPage() {
  const recentOrders = mockRentalOrders.slice(0, 5);
  const activeMaintenances = mockMaintenanceWindows.filter(m => m.status !== "COMPLETED");
  const pendingOrders = mockRentalOrders.filter(r => r.status === "CREATED");

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Fleet Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your fleet operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total Cars"
          value={mockDashboardStats.totalCars}
          icon={Car}
          variant="default"
        />
        <StatCard
          title="Available"
          value={mockDashboardStats.availableCars}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Active Rentals"
          value={mockDashboardStats.activeRentals}
          icon={Clock}
          variant="primary"
        />
        <StatCard
          title="In Maintenance"
          value={mockDashboardStats.carsInMaintenance}
          icon={Wrench}
          variant="warning"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${mockDashboardStats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Orders"
          value={mockDashboardStats.pendingOrders}
          icon={ClipboardList}
          variant="primary"
        />
      </div>

      {/* Alerts */}
      {(pendingOrders.length > 0 || activeMaintenances.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {pendingOrders.length > 0 && (
            <Card className="bg-cargo-warning/10 border-cargo-warning/20">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cargo-warning/20">
                    <AlertTriangle className="h-5 w-5 text-cargo-warning" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Pending Orders</h4>
                    <p className="text-sm text-muted-foreground">
                      {pendingOrders.length} orders waiting for confirmation
                    </p>
                  </div>
                  <Link href="/manager/rentals">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeMaintenances.length > 0 && (
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Active Maintenance</h4>
                    <p className="text-sm text-muted-foreground">
                      {activeMaintenances.length} cars currently in service
                    </p>
                  </div>
                  <Link href="/manager/maintenance">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/manager/rentals">
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {order.car?.make} {order.car?.model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.client?.firstName} {order.client?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} size="sm" />
                    <p className="text-xs text-muted-foreground mt-1">
                      ${order.totalPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fleet Status */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Fleet Status</CardTitle>
            <Link href="/manager/cars">
              <Button variant="ghost" size="sm" className="text-primary">
                Manage
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCars.slice(0, 6).map((car) => (
                <div 
                  key={car.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {car.make} {car.model}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {car.plateNumber}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={car.status} size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 bg-gradient-to-br from-primary/20 via-card to-primary/10 border-primary/20">
        <CardContent className="py-6">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/manager/cars">
              <Button variant="outline" className="border-border">
                <Car className="h-4 w-4 mr-2" />
                Add New Car
              </Button>
            </Link>
            <Link href="/manager/tariffs">
              <Button variant="outline" className="border-border">
                <DollarSign className="h-4 w-4 mr-2" />
                Manage Tariffs
              </Button>
            </Link>
            <Link href="/manager/maintenance">
              <Button variant="outline" className="border-border">
                <Wrench className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
