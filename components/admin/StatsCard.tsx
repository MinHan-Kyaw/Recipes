import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  delay = 0.1,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{value}</p>
            <Icon className={`h-6 w-6 ${iconColor} opacity-80`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
