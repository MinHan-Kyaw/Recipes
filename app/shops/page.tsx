"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { Loader, Store, Phone, MapPin, Info, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MapSelector from "@/components/MapSelector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Shop {
  _id: string;
  shopName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessHours: string;
  categories: string[];
  logo: {
    url: string;
    filename: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  distance: number;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setMapLoaded(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to a location (e.g., New York City)
          setCurrentLocation({ lat: 40.7128, lng: -74.006 });
          setMapLoaded(true);
        }
      );
    } else {
      // Geolocation not supported
      setCurrentLocation({ lat: 40.7128, lng: -74.006 });
      setMapLoaded(true);
    }
  }, []);

  const calculateDistance = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371; // Radius of the earth in km
      const dLat = degreesToRadians(lat2 - lat1);
      const dLng = degreesToRadians(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) *
          Math.cos(degreesToRadians(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    },
    []
  );

  const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  // Add this ref at the top of your component
  const lastFetchedLocationRef = useRef<{ lat: number; lng: number } | null>(
    null
  );

  const fetchShops = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/shops/coordinates/${currentLocation.lat}/${currentLocation.lng}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }

      const data = await response.json();
      setShops(data.shops);

      // Extract all unique categories
      const categories = data.shops.flatMap(
        (shop: Shop) => shop.categories || []
      );
      setAllCategories(Array.from(new Set(categories)));
    } catch (err) {
      setError("Failed to load shops. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation]);

  useEffect(() => {
    // Fetch shops when location is available and has changed significantly
    if (mapLoaded && currentLocation.lat !== 0 && currentLocation.lng !== 0) {
      // Store the last fetched location in a ref to avoid unnecessary fetches
      if (
        !lastFetchedLocationRef.current ||
        calculateDistance(
          lastFetchedLocationRef.current.lat,
          lastFetchedLocationRef.current.lng,
          currentLocation.lat,
          currentLocation.lng
        ) > 0.05
      ) {
        // Only fetch if moved more than 50 meters
        lastFetchedLocationRef.current = { ...currentLocation };
        fetchShops();
      }
    }
  }, [
    mapLoaded,
    currentLocation.lat,
    currentLocation.lng,
    currentLocation,
    calculateDistance,
    fetchShops,
  ]);

  const handleLocationChange = useCallback(
    (lat: number, lng: number) => {
      // Round to 6 decimal places (approx. 11cm precision at the equator)
      const roundedLat = parseFloat(lat.toFixed(6));
      const roundedLng = parseFloat(lng.toFixed(6));

      // Check if position has changed significantly before updating
      if (
        Math.abs(roundedLat - currentLocation.lat) > 0.000001 ||
        Math.abs(roundedLng - currentLocation.lng) > 0.000001
      ) {
        setCurrentLocation({ lat: roundedLat, lng: roundedLng });
      }
    },
    [currentLocation]
  );

  const filteredShops = shops.filter((shop) => {
    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.city.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory =
      !selectedCategory ||
      (shop.categories && shop.categories.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Browse Shops Near You
        </motion.h1>
        <motion.p
          className="text-gray-500 max-w-2xl text-center mb-8"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover amazing food shops in your area. Find local producers,
          specialty stores, and more.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-96">
            {mapLoaded ? (
              <MapSelector
                initialPosition={currentLocation}
                onLocationChange={handleLocationChange}
                useCurrentLocation={true}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-4">Filter Shops</h2>
            <Input
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            {allCategories.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Clear Filter
                    </Badge>
                  )}
                  {allCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-2">Your Location</h2>
            <p className="text-sm text-gray-500 mb-4">
              Showing shops near:
              <br />
              Lat: {currentLocation.lat.toFixed(6)}
              <br />
              Lng: {currentLocation.lng.toFixed(6)}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setCurrentLocation({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    });
                  });
                }
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Reset to Current Location
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <p className="text-red-500">{error}</p>
          <Button variant="default" onClick={fetchShops} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <Store className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No shops found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || selectedCategory
              ? "Try changing your search criteria or filters"
              : "There are no shops near your current location."}
          </p>
          {(searchTerm || selectedCategory) && (
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredShops.map((shop) => (
            <motion.div
              key={shop._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={item}
            >
              <div className="h-48 relative">
                {shop.logo?.url ? (
                  <Image
                    src={shop.logo.url}
                    alt={shop.shopName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full bg-gray-200 flex items-center justify-center">
                    <Store className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-800">
                  {shop.distance < 1
                    ? `${(shop.distance * 1000).toFixed(0)}m away`
                    : `${shop.distance.toFixed(1)}km away`}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{shop.shopName}</h3>

                <div className="flex items-start gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {shop.address}, {shop.city}, {shop.state}
                  </span>
                </div>

                {shop.businessHours && (
                  <div className="flex items-start gap-2 text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{shop.businessHours}</span>
                  </div>
                )}

                {shop.categories && shop.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3 mt-3">
                    {shop.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}

                <Link href={`/shops/${shop._id}`}>
                  <Button variant="default" className="w-full mt-2">
                    View Details
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
