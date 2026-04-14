// CarGO Business Entity Types

export type CarClass = "ECONOMY" | "COMFORT" | "BUSINESS" | "PREMIUM" | "SUV";
export type CarStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE" | "RESERVED";
export type RentalStatus = "CREATED" | "CONFIRMED" | "ISSUED" | "COMPLETED" | "CANCELLED";
export type UserRole = "CLIENT" | "FLEET_MANAGER";

export interface Car {
  id: string;
  vin: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  carClass: CarClass;
  status: CarStatus;
  imageUrl: string;
  features: string[];
  seats: number;
  transmission: "AUTOMATIC" | "MANUAL";
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
  dailyRate: number;
}

export interface Tariff {
  id: string;
  name: string;
  carClass: CarClass;
  basePrice: number;
  dailyPrice: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  mileageLimit: number;
  extraMileageCost: number;
  insuranceIncluded: boolean;
  description: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  totalRentals: number;
  createdAt: string;
}

export interface RentalOrder {
  id: string;
  carId: string;
  car?: Car;
  clientId: string;
  client?: Client;
  tariffId: string;
  tariff?: Tariff;
  status: RentalStatus;
  pickupLocation: string;
  returnLocation: string;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  totalDays: number;
  basePrice: number;
  totalPrice: number;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  status: RentalStatus;
  timestamp: string;
  note?: string;
}

export interface MaintenanceWindow {
  id: string;
  carId: string;
  car?: Car;
  serviceType: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
  cost?: number;
}

export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  activeRentals: number;
  carsInMaintenance: number;
  monthlyRevenue: number;
  pendingOrders: number;
}

// Navigation items for different roles
export const clientNavItems = [
  { label: "Home", href: "/" },
  { label: "Cars", href: "/cars" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Contact", href: "/#contact" },
];

export const clientDashboardNavItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Rentals", href: "/dashboard/rentals" },
  { label: "Browse Cars", href: "/cars" },
  { label: "Profile", href: "/dashboard/profile" },
];

export const managerNavItems = [
  { label: "Dashboard", href: "/manager" },
  { label: "Cars", href: "/manager/cars" },
  { label: "Tariffs", href: "/manager/tariffs" },
  { label: "Rentals", href: "/manager/rentals" },
  { label: "Maintenance", href: "/manager/maintenance" },
];
