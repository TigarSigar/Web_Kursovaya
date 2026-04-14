"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calendar, Search, Check } from "lucide-react";
import { locations } from "@/lib/mock-data";

interface SearchFormProps {
  variant?: "hero" | "compact";
}

export function SearchForm({ variant = "hero" }: SearchFormProps) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [carClass, setCarClass] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (carClass) params.set("class", carClass);
    router.push(`/cars?${params.toString()}`);
  };

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px]">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Location" />
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
        <div className="flex-1 min-w-[140px]">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-input border-border"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-input border-border"
          />
        </div>
        <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Glass card container */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Pickup Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Pickup Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="pl-10 bg-input/50 border-border/50 h-12 text-foreground">
                  <SelectValue placeholder="City or Airport" />
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

          {/* Pickup Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Pickup Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 bg-input/50 border-border/50 h-12 text-foreground"
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Return Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 bg-input/50 border-border/50 h-12 text-foreground"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-transparent select-none hidden md:block">Search</Label>
            <Button 
              onClick={handleSearch}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>No hidden fees</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>Instant confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>Free cancellation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
