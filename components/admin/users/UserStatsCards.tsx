import { Users, UserX, Store, ShieldCheck } from "lucide-react";
import { User } from "@/lib/types/user";
import { StatsCard } from "../StatsCard";

interface UserStatsCardsProps {
  users: User[];
}

export function UserStatsCards({ users }: UserStatsCardsProps) {
  // Calculate stats
  const totalUserCount = users.length;
  const unverifiedUserCount = users.filter(
    (user) => user.status === "unverified"
  ).length;
  const shopOwnerCount = users.filter(
    (user) => user.shops && user.shops.length > 0
  ).length;
  const adminCount = users.filter((user) => user.type === "admin").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total Users"
        value={totalUserCount}
        icon={Users}
        delay={0.1}
      />
      <StatsCard
        title="Unverified Users"
        value={unverifiedUserCount}
        icon={UserX}
        iconColor="text-amber-500"
        delay={0.2}
      />
      <StatsCard
        title="Shop Owners"
        value={shopOwnerCount}
        icon={Store}
        iconColor="text-green-500"
        delay={0.3}
      />
      <StatsCard
        title="Admins"
        value={adminCount}
        icon={ShieldCheck}
        iconColor="text-purple-500"
        delay={0.4}
      />
    </div>
  );
}
