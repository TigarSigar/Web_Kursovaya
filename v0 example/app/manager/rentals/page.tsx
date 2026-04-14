"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/cargo/status-badge";
import { RentalTimeline } from "@/components/cargo/rental-timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { mockRentalOrders } from "@/lib/mock-data";
import type { RentalStatus, RentalOrder } from "@/lib/types";
import { 
  Search, 
  Car,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  Play,
  Eye
} from "lucide-react";

const rentalStatuses: RentalStatus[] = ["CREATED", "CONFIRMED", "ISSUED", "COMPLETED", "CANCELLED"];

export default function RentalsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedRental, setSelectedRental] = useState<RentalOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredRentals = mockRentalOrders.filter((rental) => {
    const matchesSearch = 
      rental.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.car?.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.car?.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.client?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.client?.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || rental.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const openRentalDetails = (rental: RentalOrder) => {
    setSelectedRental(rental);
    setIsDrawerOpen(true);
  };

  const getStatusActions = (status: RentalStatus) => {
    switch (status) {
      case "CREATED":
        return [
          { label: "Confirm", icon: CheckCircle, variant: "default" as const },
          { label: "Cancel", icon: XCircle, variant: "destructive" as const },
        ];
      case "CONFIRMED":
        return [
          { label: "Issue Rental", icon: Play, variant: "default" as const },
          { label: "Cancel", icon: XCircle, variant: "destructive" as const },
        ];
      case "ISSUED":
        return [
          { label: "Complete Rental", icon: CheckCircle, variant: "default" as const },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Rental Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage all rental orders and their statuses
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {rentalStatuses.map((status) => {
          const count = mockRentalOrders.filter(r => r.status === status).length;
          return (
            <Card 
              key={status} 
              className={`bg-card/50 border-border/50 cursor-pointer hover:border-primary/30 transition-colors ${
                filterStatus === status ? "border-primary" : ""
              }`}
              onClick={() => setFilterStatus(filterStatus === status ? "all" : status)}
            >
              <CardContent className="py-4 text-center">
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{status.toLowerCase()}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50 mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, car, or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] bg-input border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {rentalStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Vehicle</TableHead>
                <TableHead className="text-muted-foreground">Client</TableHead>
                <TableHead className="text-muted-foreground">Period</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentals.map((rental) => {
                const actions = getStatusActions(rental.status);
                return (
                  <TableRow key={rental.id} className="border-border">
                    <TableCell className="font-mono text-sm text-foreground">
                      {rental.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <Car className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {rental.car?.make} {rental.car?.model}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rental.car?.plateNumber}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">
                        {rental.client?.firstName} {rental.client?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rental.client?.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">
                        {new Date(rental.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rental.totalDays} days
                      </p>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      ${rental.totalPrice}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rental.status} size="sm" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openRentalDetails(rental)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {actions.slice(0, 1).map((action) => (
                          <Button
                            key={action.label}
                            variant={action.variant === "destructive" ? "ghost" : "outline"}
                            size="sm"
                            className={action.variant === "destructive" ? "text-destructive" : ""}
                          >
                            <action.icon className="h-4 w-4 mr-1" />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredRentals.length === 0 && (
            <div className="py-12 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No rental orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rental Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg bg-background border-border overflow-y-auto">
          {selectedRental && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>Order Details</span>
                  <StatusBadge status={selectedRental.status} />
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Order ID */}
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-foreground">{selectedRental.id}</p>
                </div>

                {/* Vehicle */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {selectedRental.car?.make} {selectedRental.car?.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedRental.car?.plateNumber} | {selectedRental.car?.carClass}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Client */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {selectedRental.client?.firstName} {selectedRental.client?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedRental.client?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dates & Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rental Period</p>
                      <p className="text-foreground">
                        {new Date(selectedRental.startDate).toLocaleDateString()} - {new Date(selectedRental.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup</p>
                      <p className="text-foreground">{selectedRental.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Return</p>
                      <p className="text-foreground">{selectedRental.returnLocation}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground">{selectedRental.totalDays} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tariff</span>
                    <span className="text-foreground">{selectedRental.tariff?.name}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary text-xl">${selectedRental.totalPrice}</span>
                  </div>
                </div>

                <Separator />

                {/* Timeline */}
                <RentalTimeline 
                  history={selectedRental.statusHistory} 
                  currentStatus={selectedRental.status} 
                />

                {/* Actions */}
                {getStatusActions(selectedRental.status).length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {getStatusActions(selectedRental.status).map((action) => (
                        <Button
                          key={action.label}
                          variant={action.variant === "destructive" ? "outline" : "default"}
                          className={action.variant === "destructive" 
                            ? "border-destructive text-destructive hover:bg-destructive/10" 
                            : "bg-primary hover:bg-primary/90"
                          }
                        >
                          <action.icon className="h-4 w-4 mr-2" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Summary */}
      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredRentals.length} of {mockRentalOrders.length} orders
      </div>
    </div>
  );
}
