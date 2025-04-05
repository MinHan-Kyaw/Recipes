"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";
import { useAuth } from "@/components/AuthProvider";
import MainHeaderBackground from "./MainHeaderBackground";
import {
  Menu,
  Search,
  LogOut,
  UserCircle,
  PlusCircle,
  Store,
  Bookmark,
  Settings,
  ShoppingBag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function MainHeader() {
  const { user, loading, logout, refreshUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      refreshUser();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [refreshUser, loading]);

  // Get first letter of user's name for the avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  // Animation variants
  const logoAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  const navItemAnimation = {
    initial: { y: -20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: i * 0.1,
      },
    }),
  };

  return (
    <>
      <MainHeaderBackground />
      <header
        className={cn(
          "fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-4 md:px-[10%] transition-all duration-300 z-50",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <motion.div
          initial="initial"
          animate="animate"
          variants={logoAnimation}
        >
          <Link
            href="/"
            className="flex items-center gap-3 no-underline font-bold font-['Montserrat'] tracking-wider text-xl lg:text-2xl"
          >
            <Image
              src={logoImg.src}
              alt="NextLevel Food logo"
              priority
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
              style={{
                filter: "drop-shadow(0 0 0.5rem rgba(46, 139, 87, 0.3))",
              }}
            />
            <motion.span
              className="text-primary hidden sm:inline-block"
              whileHover={{
                scale: 1.05,
                background: "linear-gradient(90deg, #2E8B57, #87CEEB)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              transition={{ duration: 0.2 }}
            >
              NextLevel Food
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <motion.div
            custom={0}
            initial="initial"
            animate="animate"
            variants={navItemAnimation}
          >
            <Button
              variant="ghost"
              className="rounded-full px-4 hover:bg-primary/10 hover:text-primary flex items-center gap-2 font-medium"
              asChild
            >
              <Link href="/recipes">
                <Search className="w-4 h-4" />
                Browse Meals
              </Link>
            </Button>
          </motion.div>

          {!loading && (
            <motion.div
              custom={1}
              initial="initial"
              animate="animate"
              variants={navItemAnimation}
            >
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 bg-white/80 hover:bg-white/90 px-3 py-2 rounded-full cursor-pointer transition-all border border-gray-100 shadow-sm">
                      <Avatar className="w-8 h-8 border-2 border-primary/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                          {getInitial(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">
                        {user.name.split(" ")[0]}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-2 rounded-xl shadow-lg border-gray-100"
                  >
                    <div className="p-3 flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-primary/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                          {getInitial(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <DropdownMenuLabel className="p-0 font-bold">
                          {user.name}
                        </DropdownMenuLabel>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <Link href="/profile">
                        <UserCircle className="w-4 h-4" />
                        Your Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <Link href="/recipes/create">
                        <PlusCircle className="w-4 h-4" />
                        Share Recipe
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <Link href="/register-shop">
                        <Store className="w-4 h-4" />
                        Register Shop
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <Link href="/my-recipes">
                        <Bookmark className="w-4 h-4" />
                        My Recipes
                      </Link>
                    </DropdownMenuItem>

                    {user.shops && user.shops.length > 0 && (
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2 py-2 cursor-pointer"
                      >
                        <Link href="/my-shops">
                          <ShoppingBag className="w-4 h-4" />
                          My Shops
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {user.type === "admin" && (
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2 py-2 cursor-pointer"
                      >
                        <Link href="/admin-dashboard">
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 py-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                  >
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="rounded-full px-6 shadow-md shadow-primary/20"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-xl p-4 flex flex-col gap-2 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/recipes"
              className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-lg text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="w-4 h-4" />
              Browse Meals
            </Link>

            {!loading && !user ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 hover:bg-primary/10 rounded-lg text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : user ? (
              <>
                <div className="p-3 flex items-center gap-3 border-b border-gray-100 mb-2">
                  <Avatar className="w-10 h-10 border-2 border-primary/20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitial(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-lg text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserCircle className="w-4 h-4" />
                  Your Profile
                </Link>
                <Link
                  href="/recipes/create"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-lg text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlusCircle className="w-4 h-4" />
                  Share Recipe
                </Link>
                <Link
                  href="/my-recipes"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-lg text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bookmark className="w-4 h-4" />
                  My Recipes
                </Link>

                {user.shops && user.shops.length > 0 && (
                  <Link
                    href="/my-shops"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-lg text-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    My Shops
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : null}
          </motion.div>
        )}
      </header>
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16 md:h-20"></div>
    </>
  );
}
