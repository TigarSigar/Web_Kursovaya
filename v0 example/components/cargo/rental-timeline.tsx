import { cn } from "@/lib/utils";
import type { StatusHistoryEntry, RentalStatus } from "@/lib/types";
import { CheckCircle2, Clock, XCircle, Circle } from "lucide-react";

interface RentalTimelineProps {
  history: StatusHistoryEntry[];
  currentStatus: RentalStatus;
}

const statusOrder: RentalStatus[] = ["CREATED", "CONFIRMED", "ISSUED", "COMPLETED"];

const statusConfig: Record<RentalStatus, { icon: typeof CheckCircle2; color: string }> = {
  CREATED: { icon: Circle, color: "text-muted-foreground" },
  CONFIRMED: { icon: Clock, color: "text-primary" },
  ISSUED: { icon: CheckCircle2, color: "text-cargo-success" },
  COMPLETED: { icon: CheckCircle2, color: "text-cargo-success" },
  CANCELLED: { icon: XCircle, color: "text-destructive" },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RentalTimeline({ history, currentStatus }: RentalTimelineProps) {
  const isCancelled = currentStatus === "CANCELLED";
  const displayStatuses = isCancelled 
    ? history.map(h => h.status)
    : statusOrder;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">Rental Progress</h4>
      <div className="relative">
        {displayStatuses.map((status, index) => {
          const historyEntry = history.find(h => h.status === status);
          const isCompleted = historyEntry !== undefined;
          const isCurrent = status === currentStatus;
          const config = statusConfig[status];
          const Icon = config.icon;

          return (
            <div key={status} className="flex gap-4">
              {/* Timeline line and dot */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted || isCurrent
                    ? `${config.color} border-current bg-current/10`
                    : "border-muted text-muted bg-muted/20"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                {index < displayStatuses.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-12 -my-1",
                    isCompleted ? "bg-primary/50" : "bg-muted"
                  )} />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <p className={cn(
                  "font-medium",
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </p>
                {historyEntry && (
                  <p className="text-sm text-muted-foreground">
                    {formatDate(historyEntry.timestamp)}
                  </p>
                )}
                {historyEntry?.note && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    {historyEntry.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
