"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shop } from "@/lib/types/shop";
import CountrySelector from "@/components/CountrySelector";
import { Loader } from "lucide-react";
import MapSelector from "@/components/MapSelector";
import { fetchShopById, updateShop } from "@/lib/api/shops";
import Cookies from "js-cookie";

export default function EditShop({ params }: { params: { shopId: string } }) {
  const router = useRouter();
  const { shopId } = params;

  const [formData, setFormData] = useState<Shop>({
    shopName: "",
    owner: "",
    ownerName: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    businessHours: "",
    categories: [] as string[],
    logo: { url: "", filename: "" },
    location: { lat: 0, lng: 0 },
    isApproved: false,
    createdAt: new Date(),
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);
  const [useMap, setUseMap] = useState(false);

  // Shop categories
  const shopCategories = [
    "Restaurant",
    "Cafe",
    "Bakery",
    "Food Truck",
    "Catering",
    "Grocery",
    "Specialty Foods",
    "Other",
  ];

  // Fetch shop data
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const result = await fetchShopById(shopId);

        if (result) {
          const shopData = result;
          setFormData({
            ...shopData,
            // Ensure location has default values if not present
            location: shopData.location || { lat: 0, lng: 0 },
          });

          // Set logo preview if available
          if (shopData.logo && shopData.logo.url) {
            setLogoPreview(shopData.logo.url);
          }
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
        setError("Failed to load shop data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle location input changes
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;

    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name === "lat" ? "lat" : "lng"]: numValue,
      },
    }));
  };

  // Update location from map
  const handleMapLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      location: { lat, lng },
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), category],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: (prev.categories || []).filter((c) => c !== category),
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);

      // Create a preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData((prev) => ({
      ...prev,
      logo: { url: "", filename: "" },
    }));
    // Reset the file input
    const fileInput = document.getElementById("logo") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const nextStep = () => {
    setFormStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;

    setUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append("files", logoFile);
      formData.append("folder", "Shops");

      const response = await fetch("/api/uploads/bulk", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload logo");
      }

      const result = await response.json();

      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("Logo upload failed");
      }

      return {
        url: result.data[0].url,
        filename: result.data[0].filename,
      };
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    } finally {
      setUploadProgress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Upload logo if provided
      let logoData = formData.logo;
      if (logoFile) {
        const uploadedLogo = await uploadLogo();
        if (!uploadedLogo) {
          throw new Error("Failed to upload logo");
        }
        logoData = uploadedLogo;
      }

      // Prepare final form data with logo URL
      const finalFormData = {
        ...formData,
        logo: logoData,
      };
      const token = Cookies.get("token");
      const userId = token
        ? JSON.parse(atob(token.split(".")[1])).userId
        : null;

      const result = await updateShop(shopId as string, finalFormData, userId);

      if (!result) {
        throw new Error(result.error || "Failed to update shop");
      }

      // Redirect to the shop page or shops list
      router.push("/my-shops");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading shop data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-3xl font-bold text-center text-primary">
            Edit Your Shop
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Error display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            <div
              className={`h-2 flex-1 rounded-full ${
                formStep >= 1 ? "bg-primary" : "bg-muted"
              }`}
            ></div>
            <div
              className={`h-2 flex-1 rounded-full ${
                formStep >= 2 ? "bg-primary" : "bg-muted"
              }`}
            ></div>
            <div
              className={`h-2 flex-1 rounded-full ${
                formStep >= 3 ? "bg-primary" : "bg-muted"
              }`}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {formStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name </Label>
                    <span className="text-red-500">*</span>
                    <Input
                      id="shopName"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name </Label>
                    <span className="text-red-500">*</span>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address </Label>
                    <span className="text-red-500">*</span>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number </Label>
                    <span className="text-red-500">*</span>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Shop Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Shop Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer flex-1"
                    />
                    {logoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveLogo}
                        size="sm"
                        className="text-red-500"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Logo preview */}
                  {logoPreview && (
                    <div className="mt-4">
                      <div className="w-32 h-32 border rounded overflow-hidden relative group">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={handleRemoveLogo}
                            className="text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Location Information</h2>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address </Label>
                  <span className="text-red-500">*</span>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City </Label>
                    <span className="text-red-500">*</span>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province </Label>
                    <span className="text-red-500">*</span>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code </Label>
                    <span className="text-red-500">*</span>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Country selector */}
                  <CountrySelector
                    value={formData.country}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, country: value }))
                    }
                  />
                </div>

                {/* Location Coordinates */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Location Coordinates</Label>
                    <div className="flex items-center">
                      <Checkbox
                        id="useMap"
                        checked={useMap}
                        onCheckedChange={(checked) => setUseMap(!!checked)}
                      />
                      <label htmlFor="useMap" className="ml-2 text-sm">
                        Use Map
                      </label>
                    </div>
                  </div>

                  {useMap ? (
                    <div className="h-80 border rounded overflow-hidden">
                      <MapSelector
                        initialPosition={formData.location}
                        onLocationChange={handleMapLocationChange}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="lat">Latitude</Label>
                        <span className="text-red-500">*</span>
                        <Input
                          type="number"
                          step="any"
                          id="lat"
                          name="lat"
                          value={formData.location?.lat || 0}
                          onChange={handleLocationChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lng">Longitude</Label>
                        <span className="text-red-500">*</span>
                        <Input
                          type="number"
                          step="any"
                          id="lng"
                          name="lng"
                          value={formData.location?.lng || 0}
                          onChange={handleLocationChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Display coordinates */}
                  <div className="text-sm text-muted-foreground">
                    Current coordinates: {formData.location?.lat.toFixed(6)},{" "}
                    {formData.location?.lng.toFixed(6)}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" onClick={prevStep} variant="outline">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  Additional Information
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Textarea
                    id="businessHours"
                    name="businessHours"
                    value={formData.businessHours}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g., Mon-Fri: 9am-6pm, Sat: 10am-4pm, Sun: Closed"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Shop Categories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {shopCategories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={formData.categories?.includes(category)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(category, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" onClick={prevStep} variant="outline">
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? uploadProgress
                        ? "Uploading Logo..."
                        : "Updating..."
                      : "Update Shop"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
