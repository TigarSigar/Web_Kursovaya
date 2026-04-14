"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { mockTariffs } from "@/lib/mock-data";
import type { CarClass } from "@/lib/types";
import { 
  Plus, 
  Pencil, 
  Tag,
  Shield,
  Gauge,
  Percent
} from "lucide-react";

const carClasses: CarClass[] = ["ECONOMY", "COMFORT", "BUSINESS", "PREMIUM", "SUV"];

const classColors: Record<CarClass, string> = {
  ECONOMY: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  COMFORT: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  BUSINESS: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  PREMIUM: "bg-primary/20 text-primary border-primary/30",
  SUV: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function TariffsManagementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tariff Management</h1>
          <p className="text-muted-foreground mt-1">
            Configure pricing plans for your fleet
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Tariff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Tariff</DialogTitle>
              <DialogDescription>
                Create a new pricing plan for a car class
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>Tariff Name</Label>
                <Input placeholder="e.g. Economy Basic" className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Car Class</Label>
                <Select>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {carClasses.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Base Price ($)</Label>
                <Input type="number" placeholder="20" className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Daily Price ($)</Label>
                <Input type="number" placeholder="50" className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Mileage Limit (km/day)</Label>
                <Input type="number" placeholder="200" className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Weekly Discount (%)</Label>
                <Input type="number" placeholder="10" className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Monthly Discount (%)</Label>
                <Input type="number" placeholder="20" className="bg-input border-border" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Input placeholder="Tariff description" className="bg-input border-border" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddDialogOpen(false)}>
                Create Tariff
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tariff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTariffs.map((tariff) => (
          <Card key={tariff.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className={classColors[tariff.carClass]}>
                    {tariff.carClass}
                  </Badge>
                  <CardTitle className="mt-3 text-xl">{tariff.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{tariff.description}</p>
              
              {/* Pricing */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">${tariff.dailyPrice}</span>
                <span className="text-muted-foreground">/day</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Base Price</p>
                    <p className="font-medium text-foreground">${tariff.basePrice}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Mileage Limit</p>
                    <p className="font-medium text-foreground">{tariff.mileageLimit} km/day</p>
                  </div>
                </div>
              </div>

              {/* Discounts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Percent className="h-3 w-3" />
                    Weekly Discount
                  </span>
                  <span className="text-cargo-success font-medium">{tariff.weeklyDiscount}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Percent className="h-3 w-3" />
                    Monthly Discount
                  </span>
                  <span className="text-cargo-success font-medium">{tariff.monthlyDiscount}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Gauge className="h-3 w-3" />
                    Extra Mileage
                  </span>
                  <span className="text-foreground font-medium">${tariff.extraMileageCost}/km</span>
                </div>
              </div>

              {/* Insurance */}
              {tariff.insuranceIncluded && (
                <div className="flex items-center gap-2 p-3 bg-cargo-success/10 rounded-lg border border-cargo-success/20">
                  <Shield className="h-4 w-4 text-cargo-success" />
                  <span className="text-sm text-foreground">Insurance included</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
