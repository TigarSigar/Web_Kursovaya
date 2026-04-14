"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/cargo/navbar";
import { CarCard } from "@/components/cargo/car-card";
import { SearchForm } from "@/components/cargo/search-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientNavItems, type CarClass, type CarStatus } from "@/lib/types";
import { mockCars } from "@/lib/mock-data";
import { SlidersHorizontal, X, Car } from "lucide-react";

const carClasses: CarClass[] = ["ECONOMY", "COMFORT", "BUSINESS", "PREMIUM", "SUV"];
const carStatuses: CarStatus[] = ["AVAILABLE", "RENTED", "MAINTENANCE", "RESERVED"];

export default function CarsPage() {
  const [selectedClasses, setSelectedClasses] = useState<CarClass[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCars = useMemo(() => {
    return mockCars.filter((car) => {
      // Filter by class
      if (selectedClasses.length > 0 && !selectedClasses.includes(car.carClass)) {
        return false;
      }
      // Filter by price
      if (car.dailyRate < priceRange[0] || car.dailyRate > priceRange[1]) {
        return false;
      }
      // Filter by availability
      if (showAvailableOnly && car.status !== "AVAILABLE") {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.carClass.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedClasses, priceRange, showAvailableOnly, searchQuery]);

  const toggleClass = (carClass: CarClass) => {
    setSelectedClasses((prev) =>
      prev.includes(carClass)
        ? prev.filter((c) => c !== carClass)
        : [...prev, carClass]
    );
  };

  const clearFilters = () => {
    setSelectedClasses([]);
    setPriceRange([0, 200]);
    setShowAvailableOnly(true);
    setSearchQuery("");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Search</Label>
        <Input
          placeholder="Search cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input border-border"
        />
      </div>

      {/* Car Class */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Car Class</Label>
        <div className="space-y-2">
          {carClasses.map((carClass) => (
            <div key={carClass} className="flex items-center space-x-2">
              <Checkbox
                id={carClass}
                checked={selectedClasses.includes(carClass)}
                onCheckedChange={() => toggleClass(carClass)}
              />
              <label
                htmlFor={carClass}
                className="text-sm text-muted-foreground cursor-pointer capitalize"
              >
                {carClass.toLowerCase()}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Price Range</Label>
          <span className="text-sm text-muted-foreground">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={200}
          step={10}
          className="mt-2"
        />
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="available"
          checked={showAvailableOnly}
          onCheckedChange={(checked) => setShowAvailableOnly(checked as boolean)}
        />
        <label
          htmlFor="available"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Show available only
        </label>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border-border"
        onClick={clearFilters}
      >
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar navItems={clientNavItems} showAuth />

      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Cars</h1>
          <p className="text-muted-foreground">Find and book your perfect vehicle</p>
          
          {/* Compact Search Form */}
          <div className="mt-6">
            <SearchForm variant="compact" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <Card className="bg-card/50 border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full border-border">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {(selectedClasses.length > 0 || !showAvailableOnly) && (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        {selectedClasses.length + (!showAvailableOnly ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-background border-border">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{filteredCars.length}</span> cars found
              </p>
            </div>

            {/* Cars Grid */}
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                    <Car className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No cars found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find more vehicles
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
