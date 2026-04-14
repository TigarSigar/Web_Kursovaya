import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RentalStatus, CarStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: RentalStatus | CarStatus;
  size?: "sm" | "md";
}

const rentalStatusConfig: Record<RentalStatus, { label: string; className: string }> = {
  CREATED: { 
    label: "Created", 
    className: "bg-secondary text-secondary-foreground border-secondary" 
  },
  CONFIRMED: { 
    label: "Confirmed", 
    className: "bg-primary/20 text-primary border-primary/30" 
  },
  ISSUED: { 
    label: "Active", 
    className: "bg-cargo-success/20 text-cargo-success border-cargo-success/30" 
  },
  COMPLETED: { 
    label: "Completed", 
    className: "bg-muted text-muted-foreground border-muted" 
  },
  CANCELLED: { 
    label: "Cancelled", 
    className: "bg-destructive/20 text-destructive border-destructive/30" 
  },
};

const carStatusConfig: Record<CarStatus, { label: string; className: string }> = {
  AVAILABLE: { 
    label: "Available", 
    className: "bg-cargo-success/20 text-cargo-success border-cargo-success/30" 
  },
  RENTED: { 
    label: "Rented", 
    className: "bg-cargo-warning/20 text-cargo-warning border-cargo-warning/30" 
  },
  MAINTENANCE: { 
    label: "Maintenance", 
    className: "bg-muted text-muted-foreground border-muted" 
  },
  RESERVED: { 
    label: "Reserved", 
    className: "bg-primary/20 text-primary border-primary/30" 
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const isRentalStatus = ["CREATED", "CONFIRMED", "ISSUED", "COMPLETED", "CANCELLED"].includes(status);
  const config = isRentalStatus 
    ? rentalStatusConfig[status as RentalStatus] 
    : carStatusConfig[status as CarStatus];

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium",
        config.className,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
      )}
    >
      {config.label}
    </Badge>
  );
}
