import { Shop } from "@/lib/types/shop";
import { createActivityLog } from "../activitylog";

export const fetchShops = async () => {
  try {
    const response = await fetch("/api/admin/shops", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shops");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    throw error;
  }
};

export const fetchShopsCount = async () => {
  try {
    const response = await fetch("/api/admin/shops/count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shop count");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shop count:", error);
    throw error;
  }
};

// New function to approve a shop
export const approveShop = async (shopId: string, userId: string) => {
  try {
    // First, fetch the shop data to get the necessary information for logging
    const shopResponse = await fetch(`/api/admin/shops?shopId=${shopId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!shopResponse.ok) {
      throw new Error("Failed to fetch shop data");
    }

    const shopResult = await shopResponse.json();
    const shopData = shopResult.data;

    const response = await fetch("/api/admin/shops/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shopId }),
    });

    if (!response.ok) {
      throw new Error("Failed to approve shop");
    }

    const data = await response.json();

    // Create activity log after successful approval
    await createActivityLog(
      userId,
      shopData[0].shopName,
      "approve",
      `Shop approved`,
      "shop",
      `${shopData[0].shopName} was approved`,
      shopId
    );

    return data;
  } catch (error) {
    console.error("Error approving shop:", error);
    throw error;
  }
};

// New function to delete a shop
export const deleteShop = async (shopId: string) => {
  try {
    const response = await fetch(`/api/admin/shops?shopId=${shopId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete shop");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting shop:", error);
    throw error;
  }
};

// New function to update a shop
export const updateShop = async (
  shopId: string,
  shopData: Shop,
  userId: string
) => {
  try {
    const response = await fetch("/api/admin/shops", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shopId, shopData, userId }),
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
    return data;
  } catch (error) {
    console.error("Error updating shop:", error);
    throw error;
  }
};
