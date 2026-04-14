"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockMaintenanceWindows, mockCars } from "@/lib/mock-data";
import type { MaintenanceWindow } from "@/lib/types";
import { 
  Plus, 
  Wrench,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Play,
  DollarSign
} from "lucide-react";

type MaintenanceStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";

const statusConfig: Record<MaintenanceStatus, { label: string; className: string; icon: typeof Clock }> = {
  SCHEDULED: { 
    label: "Scheduled", 
    className: "bg-primary/20 text-primary border-primary/30",
    icon: Clock
  },
  IN_PROGRESS: { 
    label: "In Progress", 
    className: "bg-cargo-warning/20 text-cargo-warning border-cargo-warning/30",
    icon: Play
  },
  COMPLETED: { 
    label: "Completed", 
    className: "bg-cargo-success/20 text-cargo-success border-cargo-success/30",
    icon: CheckCircle
  },
};

export default function MaintenanceManagementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredMaintenances = mockMaintenanceWindows.filter((m) => {
    return filterStatus === "all" || m.status === filterStatus;
  });

  const scheduledCount = mockMaintenanceWindows.filter(m => m.status === "SCHEDULED").length;
  const inProgressCount = mockMaintenanceWindows.filter(m => m.status === "IN_PROGRESS").length;
  const completedCount = mockMaintenanceWindows.filter(m => m.status === "COMPLETED").length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance Windows</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and track vehicle maintenance
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
              <DialogDescription>
                Create a new maintenance window for a vehicle
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCars.map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.make} {car.model} ({car.plateNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oil">Oil Change</SelectItem>
                    <SelectItem value="regular">Regular Service</SelectItem>
                    <SelectItem value="inspection">Annual Inspection</SelectItem>
                    <SelectItem value="tires">Tire Service</SelectItem>
                    <SelectItem value="brakes">Brake Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" className="bg-input border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Estimated Cost ($)</Label>
                <Input type="number" placeholder="0" className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe the maintenance work..."
                  className="bg-input border-border min-h-[80px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddDialogOpen(false)}>
                Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card 
          className={`bg-card/50 border-border/50 cursor-pointer hover:border-primary/30 transition-colors ${
            filterStatus === "SCHEDULED" ? "border-primary" : ""
          }`}
          onClick={() => setFilterStatus(filterStatus === "SCHEDULED" ? "all" : "SCHEDULED")}
        >
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{scheduledCount}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card/50 border-border/50 cursor-pointer hover:border-cargo-warning/30 transition-colors ${
            filterStatus === "IN_PROGRESS" ? "border-cargo-warning" : ""
          }`}
          onClick={() => setFilterStatus(filterStatus === "IN_PROGRESS" ? "all" : "IN_PROGRESS")}
        >
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{inProgressCount}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-cargo-warning/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-cargo-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`bg-card/50 border-border/50 cursor-pointer hover:border-cargo-success/30 transition-colors ${
            filterStatus === "COMPLETED" ? "border-cargo-success" : ""
          }`}
          onClick={() => setFilterStatus(filterStatus === "COMPLETED" ? "all" : "COMPLETED")}
        >
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-cargo-success/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-cargo-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Vehicle</TableHead>
                <TableHead className="text-muted-foreground">Service Type</TableHead>
                <TableHead className="text-muted-foreground">Period</TableHead>
                <TableHead className="text-muted-foreground">Cost</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenances.map((maintenance) => {
                const status = statusConfig[maintenance.status];
                const StatusIcon = status.icon;
                
                return (
                  <TableRow key={maintenance.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {maintenance.car?.make} {maintenance.car?.model}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {maintenance.car?.plateNumber}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{maintenance.serviceType}</p>
                        <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {maintenance.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-foreground">
                            {new Date(maintenance.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            to {new Date(maintenance.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {maintenance.cost ? (
                        <div className="flex items-center gap-1 text-foreground">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{maintenance.cost}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {maintenance.status === "SCHEDULED" && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {maintenance.status === "IN_PROGRESS" && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        {maintenance.status === "COMPLETED" && (
                          <span className="text-sm text-muted-foreground">Done</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredMaintenances.length === 0 && (
            <div className="py-12 text-center">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No maintenance windows found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
