"use client";
import Link from "next/link";
import Image from "next/image";
import ImageSlideshow from "@/components/images/ImageSlideshow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { ChevronRight, Utensils, Users, Award, Search } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import "./globals.css";

export default function Home() {
  interface JwtPayload {
    userId: string;
    iat: number;
    exp: number;
  }

  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const featureItems = [
    {
      icon: <Utensils className="h-12 w-12 text-emerald-500" />,
      title: "Discover Recipes",
      description: "Explore thousands of recipes from around the world",
    },
    {
      icon: <Users className="h-12 w-12 text-emerald-500" />,
      title: "Connect with Foodies",
      description: "Share your culinary creations and get inspired",
    },
    {
      icon: <Award className="h-12 w-12 text-emerald-500" />,
      title: "Save Favorites",
      description: "Build your personal collection of go-to recipes",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden pt-16 pb-20">
        {/* Custom Gradient Background similar to MainHeaderBackground */}
        <div className="absolute w-full h-80 top-0 left-0 -z-10 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="block w-full h-auto"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#2e8b57", stopOpacity: "1" }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#4caf50", stopOpacity: "1" }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#daa520", stopOpacity: "0.8" }}
                />
              </linearGradient>
            </defs>
            <path
              fill="url(#gradient)"
              d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,181.3C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
            <path
              fill="#ffffff"
              fillOpacity="0.5"
              d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,160C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500 bg-clip-text text-transparent">
                  Recipe
                </span>
                <span className="text-gray-800"> for Foodies</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Discover, create, and share incredible recipes from all corners
                of the world. Join our global community of passionate food
                lovers today.
              </p>

              <div className="flex flex-wrap gap-4">
                {!loading && !user && (
                  <Button
                    variant="outline"
                    className="group relative overflow-hidden border-2 border-emerald-600 text-emerald-600 hover:text-white px-8 py-3 text-lg rounded-full transition-all duration-300"
                    asChild
                  >
                    <Link href="/auth/login">
                      <span className="relative z-10">Login</span>
                      <span className="absolute inset-0 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                    </Link>
                  </Button>
                )}

                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 text-lg rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link href="/recipes">
                    <Search className="h-5 w-5" />
                    Explore Meals
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:h-[30rem] rounded-xl overflow-hidden shadow-2xl"
            >
              <ImageSlideshow />
            </motion.div>
          </div>
        </div>
      </section>

      <main>
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-primary mb-4"
              >
                How it works
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="max-w-3xl mx-auto text-lg text-gray-600"
              >
                Our platform connects food enthusiasts to share recipes,
                discover new culinary experiences, and build a community around
                the joy of cooking and eating.
              </motion.p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {featureItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
                >
                  <div className="inline-flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Recipe Food */}
        <section className="py-16 bg-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-primary mb-6">
                    Why Recipe?
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mr-3">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-gray-600">
                        Curated recipes from professional chefs and home cooks
                        alike
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mr-3">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-gray-600">
                        Interactive cooking guides with step-by-step
                        instructions
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mr-3">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-gray-600">
                        Global community of food enthusiasts sharing their
                        passion
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mr-3">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-gray-600">
                        Personalized recommendations based on your taste
                        preferences
                      </p>
                    </li>
                  </ul>
                </div>
                <div
                  className="bg-cover bg-center h-96 lg:h-auto"
                  style={{ backgroundImage: "url('/api/placeholder/600/800')" }}
                ></div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-amber-500 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to elevate your culinary journey?
              </h2>
              <p className="text-lg md:text-xl mb-10 opacity-90 max-w-3xl mx-auto">
                Join thousands of food enthusiasts and start exploring a world
                of flavors right from your kitchen.
              </p>
              {!loading && !user ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-white text-emerald-700 hover:bg-amber-50 px-10 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/auth/register">Sign Up Now</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent text-white border-white hover:bg-white/20 px-10 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/recipes">Explore Recipes</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  className="bg-white text-emerald-700 hover:bg-amber-50 px-10 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <Link href="/recipes">Start Exploring Now</Link>
                </Button>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Recipe</h3>
              <p className="text-gray-400">
                Sharing the joy of cooking and connecting food lovers around the
                world.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/recipes"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shops"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Shops
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>
              © {new Date().getFullYear()} Recipe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
