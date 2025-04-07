"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronLeft,
  Share2,
  ExternalLink,
  UserCircle,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MapSelector from "@/components/MapSelector";
import { Shop } from "@/lib/types/shop";
import { Recipe } from "@/lib/types/recipe";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fetchShopRecipes } from "@/lib/api/recipes";

export default function ShopDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/shops/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch shop details");
        }
        const data = await response.json();
        setShop(data.data);

        // Fetch a limited number of recipes for preview
        const shopRecipes = await fetchShopRecipes(id as string, { limit: 3 });
        setRecipes(shopRecipes);
      } catch (err) {
        setError("Failed to load shop details. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchShopDetail();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Shop not found"}
        </h2>
        <Link href="/shops">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Shops
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/shops">
          <Button variant="ghost" className="pl-0">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Shops
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 md:h-80 relative">
              {shop.logo?.url ? (
                <Image
                  src={shop.logo.url}
                  alt={shop.shopName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full bg-gray-200 flex items-center justify-center">
                  <Store className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {shop.shopName}
                </h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: shop.shopName,
                          text: `Check out ${shop.shopName} on NextLevel Food!`,
                          url: window.location.href,
                        })
                        .catch((error) => {
                          if (error.name !== "AbortError") {
                            console.error("Error sharing:", error);
                          }
                        });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {shop.categories && shop.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {shop.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="text-sm"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              {shop.description && (
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700">{shop.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">
                      {shop.address}
                      <br />
                      {shop.city}, {shop.state} {shop.zipCode}
                      <br />
                      {shop.country}
                    </p>
                  </div>
                </div>

                {shop.businessHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {shop.businessHours}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <a
                      href={`tel:${shop.phone}`}
                      className="text-primary hover:underline"
                    >
                      {shop.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a
                      href={`mailto:${shop.email}`}
                      className="text-primary hover:underline"
                    >
                      {shop.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Menu Preview Section */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Featured Menu Items</h2>
                  {/* <Link href={`/shops/${id}/menu`}>
                    <Button variant="outline" className="gap-1 group">
                      View Full Menu
                      <Menu className="w-4 h-4 ml-1" />
                    </Button>
                  </Link> */}
                </div>

                {recipes.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">
                      No menu items available yet.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => router.push(`/shops/${id}/menu`)}
                    >
                      Check Menu
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recipes.slice(0, 3).map((recipe) => (
                      <Card
                        key={recipe._id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300"
                        onClick={() => router.push(`/recipes/${recipe._id}`)}
                      >
                        <div className="relative h-32 bg-gray-50 cursor-pointer">
                          {recipe.images && recipe.images.length > 0 ? (
                            <Image
                              src={recipe.images[0].url}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Store className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium line-clamp-1">
                            {recipe.title}
                          </h3>
                          {recipe.category && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {recipe.category}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex justify-center mt-4">
                  <Link href={`/shops/${id}/menu`}>
                    <Button className="gap-1 group">
                      Browse All Menu Items
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shop Owner</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{shop.ownerName}</h3>
                <p className="text-sm text-gray-500">Owner</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Contact the owner for any inquiries about this shop.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <a href={`mailto:${shop.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`tel:${shop.phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            <p className="text-gray-600 mb-4">
              Browse the full selection of menu items available at{" "}
              {shop.shopName}.
            </p>
            <Button
              variant="default"
              className="w-full gap-2"
              onClick={() => router.push(`/shops/${id}/menu`)}
            >
              <Menu className="w-4 h-4" />
              View Full Menu
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Get Directions</h2>
            <p className="text-gray-600 mb-4">
              Navigate to this shop using your preferred maps service.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.location.lat},${shop.location.lng}`;
                window.open(mapsUrl, "_blank");
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Maps
            </Button>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            {shop.location && shop.location.lat && shop.location.lng && (
              <MapSelector
                initialPosition={shop.location}
                onLocationChange={(lat, lng) => {
                  console.log("Map location changed:", { lat, lng });
                }}
                useCurrentLocation={false}
                viewOnly={true}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
