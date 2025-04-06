import { NextResponse } from "next/server";
import Shop from "@/models/Shop";
import dbConnect from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { coords } = params;
    const [lat, lng] = coords;

    // Parse the parameters to floats
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Validate the coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude parameters" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // const allShops = await Shop.find({ isApproved: true });
    const allShops = await Shop.find();

    // Calculate distance for each shop (using Haversine formula)
    const shopsWithDistance = allShops.map((shop) => {
      // Calculate distance in kilometers
      const R = 6371; // Earth's radius in km
      const dLat = ((shop.location.lat - latitude) * Math.PI) / 180;
      const dLon = ((shop.location.lng - longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((latitude * Math.PI) / 180) *
          Math.cos((shop.location.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Convert shop to plain object and add distance
      const shopObj = shop.toObject();
      shopObj.distance = distance;
      return shopObj;
    });

    // Sort by distance
    shopsWithDistance.sort((a, b) => a.distance - b.distance);

    // Return shops within 20km by default
    const nearbyShops = shopsWithDistance.filter((shop) => shop.distance <= 20);

    return NextResponse.json({ shops: nearbyShops });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Error fetching shops" },
      { status: 500 }
    );
  }
}
