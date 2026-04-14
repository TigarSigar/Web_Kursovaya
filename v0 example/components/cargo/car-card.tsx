"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Settings2, ArrowRight } from "lucide-react";
import type { Car, CarStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CarCardProps {
  car: Car;
  showBookButton?: boolean;
}

const statusConfig: Record<CarStatus, { label: string; className: string }> = {
  AVAILABLE: { label: "Available", className: "bg-cargo-success/20 text-cargo-success border-cargo-success/30" },
  RENTED: { label: "Rented", className: "bg-cargo-warning/20 text-cargo-warning border-cargo-warning/30" },
  MAINTENANCE: { label: "Maintenance", className: "bg-muted/50 text-muted-foreground border-muted" },
  RESERVED: { label: "Reserved", className: "bg-primary/20 text-primary border-primary/30" },
};

const classColors: Record<string, string> = {
  ECONOMY: "text-emerald-400",
  COMFORT: "text-sky-400",
  BUSINESS: "text-amber-400",
  PREMIUM: "text-primary",
  SUV: "text-orange-400",
};

export function CarCard({ car, showBookButton = true }: CarCardProps) {
  const status = statusConfig[car.status];
  const isAvailable = car.status === "AVAILABLE";

  return (
    <Card className={cn(
      "group relative overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-300",
      isAvailable ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10" : "opacity-75"
    )}>
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge variant="outline" className={cn("text-xs font-medium", status.className)}>
          {status.label}
        </Badge>
      </div>

      {/* Car Image */}
      <div className="relative h-44 overflow-hidden bg-secondary/30">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      </div>

      <CardContent className="p-5">
        {/* Car Class */}
        <span className={cn("text-xs font-semibold uppercase tracking-wider", classColors[car.carClass] || "text-primary")}>
          {car.carClass}
        </span>

        {/* Car Name */}
        <h3 className="text-lg font-bold text-foreground mt-1">
          {car.make} {car.model}
        </h3>
        <p className="text-sm text-muted-foreground">{car.year}</p>

        {/* Features */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 className="h-4 w-4" />
            <span>{car.transmission === "AUTOMATIC" ? "Auto" : "Manual"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4" />
            <span>{car.fuelType}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
          <div>
            <span className="text-2xl font-bold text-foreground">${car.dailyRate}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          {showBookButton && (
            <Link href={`/cars/${car.id}`}>
              <Button 
                variant={isAvailable ? "default" : "secondary"}
                size="sm"
                disabled={!isAvailable}
                className={cn(
                  isAvailable && "bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                )}
              >
                {isAvailable ? "View Details" : "Unavailable"}
                {isAvailable && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
