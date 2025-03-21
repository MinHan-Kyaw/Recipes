import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "no-underline text-primary font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out",
        isActive ? "text-food-gradient" : "hover-food-gradient",
        className
      )}
    >
      {children}
    </Link>
  );
}
