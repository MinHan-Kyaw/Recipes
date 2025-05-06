import { Shop } from "../types/shop";
import { createActivityLog } from "./activitylog";

// Helper to get base URL that works in both client and server components
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Check if window is defined (client-side)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side with no env var set
  return "http://localhost:3000";
};

/**
 * Fetch all shops that belong to a specific user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Promise resolving to an array of shops
 */
export async function fetchUserShops(userId: string) {
  try {
    const response = await fetch(`/api/shops?ownerId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch shops");
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching user shops:", error);
    throw error;
  }
}

/**
 * Fetch a single shop by ID
 * @param {string} shopId - The ID of the shop to fetch
 * @returns {Promise<Object>} - Promise resolving to the shop object
 */
export async function fetchShopById(shopId: string) {
  try {
    const response = await fetch(`/api/shops/${shopId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch shop");
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching shop:", error);
    throw error;
  }
}

/**
 * Create a new shop and update the user's shops array
 * @param {Shop} shopData - The shop data to create
 * @param {string} userId - The ID of the user creating the shop
 * @returns {Promise<Shop>} - Promise resolving to the created shop
 */
export async function createShop(shopData: Shop, userId: string) {
  try {
    // First create the shop
    const response = await fetch("/api/shops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopData),
    });

    if (!response.ok) {
      throw new Error("Failed to create shop");
    }

    const data = await response.json();
    const createdShop = data.success ? data.data : null;

    if (createdShop && userId) {
      // Now update the user to add this shop to their shops array
      const userUpdateResponse = await fetch(`/api/users/${userId}/shops`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopId: createdShop._id }),
      });

      if (!userUpdateResponse.ok) {
        console.error("Created shop but failed to update user's shops array");
      }
    }
    if (response.status === 200) {
      await createActivityLog(
        userId,
        shopData.shopName,
        "pending",
        `New shop registration`,
        "shop",
        shopData.shopName + " requested approval",
        createdShop._id
      );
    }

    return createdShop;
  } catch (error) {
    console.error("Error creating shop:", error);
    throw error;
  }
}

/**
 * Update an existing shop
 * @param {string} shopId - The ID of the shop to update
 * @param {Shop} shopData - The updated shop data
 * @returns {Promise<Shop>} - Promise resolving to the updated shop
 */
export async function updateShop(
  shopId: string,
  shopData: Shop,
  userId: string
) {
  try {
    const response = await fetch(`/api/shops/${shopId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopData),
    });

    if (!response.ok) {
      throw new Error("Failed to update shop");
    }
    const data = await response.json();
    if (response.status === 200) {
      await createActivityLog(
        userId,
        shopData.shopName,
        "update",
        `Changed business information`,
        "shop",
        shopData.shopName + " updated information",
        data.data._id
      );
    }

    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error updating shop:", error);
    throw error;
  }
}

/**
 * Delete a shop and remove it from user's shops array
 * @param {string} shopId - The ID of the shop to delete
 * @param {string} userId - The ID of the shop owner
 * @returns {Promise<boolean>} - Promise resolving to success status
 */
export async function deleteShop(shopId: string, userId: string) {
  try {
    const response = await fetch(`/api/shops/${shopId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete shop");
    }

    // After successful shop deletion, update the user
    if (userId) {
      const userUpdateResponse = await fetch(`/api/users/${userId}/shops`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopId }),
      });

      if (!userUpdateResponse.ok) {
        console.error("Deleted shop but failed to update user's shops array");
      }
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error deleting shop:", error);
    throw error;
  }
}

/**
 * Fetch all shops
 * @returns {Promise<Array>} - Promise resolving to an array of all shops
 */
export async function fetchAllShops() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/shops`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch all shops");
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching all shops:", error);
    throw error;
  }
}

/**
 * Fetch shops with coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
export async function fetchShopsWithCoordinates(lat: number, lng: number) {
  try {
    const response = await fetch(
      `/api/shops/coordinates?lat=${lat}&lng=${lng}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch shops with coordinates");
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching shops with coordinates:", error);
    throw error;
  }
}
