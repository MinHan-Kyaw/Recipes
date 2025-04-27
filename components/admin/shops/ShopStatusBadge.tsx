import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ShopStatusBadgeProps = {
  isApproved: boolean;
  className?: string;
  showIcon?: boolean;
};

export default function ShopStatusBadge({
  isApproved,
  className = "",
  showIcon = true,
}: ShopStatusBadgeProps) {
  if (isApproved) {
    return (
      <Badge
        variant="outline"
        className={`bg-green-50 text-green-700 border-green-200 ${className}`}
      >
        {showIcon && <CheckCircle className="h-3 w-3 mr-1" />}
        Approved
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`bg-amber-50 text-amber-700 border-amber-200 ${className}`}
    >
      {showIcon && <XCircle className="h-3 w-3 mr-1" />}
      Pending
    </Badge>
  );
}
