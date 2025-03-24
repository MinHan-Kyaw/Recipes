"use client";

import Link from "next/link";
import ImageSlideshow from "@/components/images/ImageSlideshow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./globals.css";

export default function Home() {
  interface JwtPayload {
    userId: string;
    iat: number;
    exp: number;
  }
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    // Get the token from cookies
    const token = Cookies.get("token");
    if (token && token !== "undefined") {
      setIsLogin(true);
      // Decode the token to get the payload
      const decodedToken = jwtDecode<JwtPayload>(token);
      // console.log("Decoded token:", decodedToken);
      // console.log("Decoded token:", decodedToken.userId);

      // Extract userId from the decoded token
      // const { userId } = decodedToken;
      // console.log("User ID from token:", userId);
    }
  }, []);

  return (
    <>
      <header className="flex flex-col md:flex-row gap-12 mx-auto my-12 w-[90%] max-w-6xl">
        <div className="w-full md:w-[40rem] h-[25rem]">
          <ImageSlideshow />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-2xl mb-4">
            <h1 className="text-2xl font-bold tracking-wider uppercase bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
              NextLevel Food for NextLevel Foodies
            </h1>
            <p className="mt-4 text-emerald-600">
              Taste & share food from all over the world.
            </p>
          </div>
          <div className="text-2xl flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="mt-4 text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 py-6 px-10 text-xl"
              asChild
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              className="ml-4 mt-4 bg-amber-500 hover:bg-amber-600 text-white py-6 px-10 text-2xl"
              asChild
            >
              <Link href="/meals">Explore Meals</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Card className="max-w-3xl w-[90%] mx-auto my-8 border-0 shadow-none">
          <CardContent className="text-center p-6">
            <h2 className="text-green-500 text-3xl font-bold mb-4">
              How it works
            </h2>
            <p className="mb-4 text-2xl text-emerald-600">
              NextLevel Food is a platform for foodies to share their favorite
              recipes with the world. It&apos;s a place to discover new dishes,
              and to connect with other food lovers.
            </p>
            <p className="text-2xl text-emerald-600">
              NextLevel Food is a place to discover new dishes, and to connect
              with other food lovers.
            </p>
          </CardContent>
        </Card>

        <Card className="max-w-3xl w-[90%] mx-auto my-8 border-0 shadow-none">
          <CardContent className="text-center p-6">
            <h2 className="text-green-500 text-3xl font-bold mb-4">
              Why NextLevel Food?
            </h2>
            <p className="mb-4 text-2xl text-emerald-600">
              NextLevel Food is a platform for foodies to share their favorite
              recipes with the world. It&apos;s a place to discover new dishes,
              and to connect with other food lovers.
            </p>
            <p className="text-2xl text-emerald-600">
              NextLevel Food is a place to discover new dishes, and to connect
              with other food lovers.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
