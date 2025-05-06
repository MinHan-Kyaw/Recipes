import { User } from "@/lib/types/user";
import { createActivityLog } from "../activitylog";

export async function fetchUsers() {
  try {
    const response = await fetch("/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function createUser(userData: User) {
  try {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: User) {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    if (data.success) {
      await createActivityLog(
        data.data._id,
        userData.name,
        "verify",
        "User verified",
        "user",
        userData.name + " verified",
        data.data._id
      );
    }
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function fetchUsersCount() {
  try {
    const response = await fetch("/api/admin/users/count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users count");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users count api:", error);
    throw error;
  }
}

export async function approveUser(userId: string) {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "verified" }),
    });

    if (!response.ok) {
      throw new Error("Failed to approve user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error approving user:", error);
    throw error;
  }
}
