import Link from "next/link";
import Image from "next/image";
import React from "react";
import logoImg from "@/assets/logo.png";
import MainHeaderBackground from "./MainHeaderBackground";
import NavLink from "./NavLink";

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className="flex justify-between items-center px-4 py-8 md:px-[10%]">
        <Link
          href="/"
          className="flex items-center justify-center gap-8 no-underline font-bold font-['Montserrat'] tracking-wider uppercase text-2xl"
        >
          <Image
            src={logoImg.src}
            alt="A plate with food on it."
            priority
            width={1024}
            height={1024}
            className="w-20 h-20 object-contain"
            style={{
              filter: "drop-shadow(0 0 0.75rem rgba(46, 139, 87, 0.3))",
            }}
          />
          <span className="text-[#2e8b57] transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#4caf50] hover:to-[#daa520] hover:bg-clip-text hover:text-transparent">
            NextLevel Food
          </span>
        </Link>

        <nav>
          <ul className="list-none m-0 p-0 flex gap-6 text-xl">
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/share">Share Recipe</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
