"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import logoImg from "@/assets/logo.png";
import MainHeaderBackground from "./MainHeaderBackground";
import NavLink from "./NavLink";
import { useAuth } from "@/components/AuthProvider";

export default function MainHeader() {
  const { user, loading, logout, refreshUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    // Only refresh if we're not currently loading
    if (!loading) {
      refreshUser();
    }
  }, [refreshUser, loading]);

  // Function to get first letter of user's name
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <span className="text-primary transition-all duration-300 ease-in-out hover-food-gradient">
            NextLevel Food
          </span>
        </Link>

        <nav>
          <ul className="list-none m-0 p-0 flex items-center">
            <li className="mr-6">
              <NavLink href="/recipes">Browse Meals</NavLink>
            </li>
            <li className="mr-6">
              <NavLink href="/recipes/create">Share Recipe</NavLink>
            </li>
            <li className="mr-6">
              <NavLink href="/register-shop">Register Shop</NavLink>
            </li>

            {!loading && (
              <li
                className={`${user ? "ml-6" : "ml-6"} relative`}
                ref={dropdownRef}
              >
                {user ? (
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors font-medium"
                    aria-label="Profile menu"
                    title={user.name}
                  >
                    {getInitial(user.name)}
                  </button>
                ) : (
                  <NavLink
                    href="/auth/login"
                    className="bg-primary text-white py-2 px-4 rounded-full hover:bg-primary/80 transition-colors"
                  >
                    Login
                  </NavLink>
                )}

                {isProfileOpen && user && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1 px-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {user.name}
                      </p>
                    </div>
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Your Profile
                      </Link>
                      
                      {/* Add My Recipes link */}
                      <Link
                        href="/my-recipes"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Recipes
                      </Link>

                      {user.shops && user.shops.length > 0 && (
                        <Link
                          href="/my-shops"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          My Shops
                        </Link>
                      )}

                      {user.type === "admin" && (
                        <Link
                          href="/admin-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout?.();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}
