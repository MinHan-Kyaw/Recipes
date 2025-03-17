"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const path = usePathname();

  const isActive = path.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        no-underline text-[#2e8b57] font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out
        ${
          isActive
            ? "bg-gradient-to-r from-[#4caf50] to-[#daa520] bg-clip-text text-transparent"
            : ""
        }
        hover:bg-gradient-to-r hover:from-[#4caf50] hover:to-[#daa520] hover:bg-clip-text hover:text-transparent
      `}
      style={{
        textShadow: isActive ? "none" : "",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textShadow = "0 0 18px rgba(218, 165, 32, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textShadow = isActive ? "none" : "";
      }}
    >
      {children}
    </Link>
  );
}
