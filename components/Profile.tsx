"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  User,
  Camera,
  Loader2,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { uploadProfileImage, updateUserProfile } from "@/lib/api/profile";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  // Add a temporary state for the uploaded file
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [tempImagePreview, setTempImagePreview] = useState<string>("");

  // Initialize form with user data when available
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Update form values when user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
      });

      if (user.avatar) {
        setProfileImageUrl(user.avatar);
      }
    }
  }, [user, form]);

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user || !user._id) return;
    const file = e.target.files[0];
    if (!file) return;
    setTempImageFile(file);

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setTempImagePreview(previewUrl);
    toast({
      title: "Image selected",
      description: "Your profile image will be uploaded when you save changes.",
    });
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return;

    try {
      setIsSaving(true);

      let uploadedImageUrl = user.avatar;
      if (tempImageFile && user._id) {
        // Show uploading status
        setIsUploading(true);

        // Upload the image using the API function
        const uploadResult = await uploadProfileImage(tempImageFile, user._id);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        // Get uploaded image URL
        if (!uploadResult.data) {
          throw new Error("No data received from upload");
        }

        uploadedImageUrl = uploadResult.data[0].url;
        setIsUploading(false);
      }

      // Prepare update data with the possibly new image URL
      const updateData = {
        name: values.name,
        email: values.email,
        avatar: uploadedImageUrl,
      };

      // Update profile using the API function
      if (!user._id) {
        throw new Error("User ID is required");
      }

      const result = await updateUserProfile(user._id, updateData);

      if (!result.success) {
        throw new Error(result.error || "Failed to update profile");
      }
      setTempImageFile(null);

      setProfileImageUrl(uploadedImageUrl || "");

      // Refresh user data in context
      await refreshUser();

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* Profile image card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Picture
              </CardTitle>
              <CardDescription>
                Upload a profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4 group">
                <Avatar className="h-48 w-48 border-4 border-primary/10 shadow-xl">
                  <AvatarImage
                    src={tempImagePreview || profileImageUrl}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-8 w-8" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </div>
              {isUploading && (
                <p className="text-sm flex items-center gap-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </p>
              )}
              {tempImageFile && (
                <p className="text-sm flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  Image selected. Click &quot;Save Changes&quot; to upload.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Profile details card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Your email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This email will be used for notifications and account
                          recovery
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full md:w-auto rounded-full gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t pt-6">
              <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg w-full">
                <AlertTriangle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Account Security</p>
                  <p className="text-sm text-amber-700">
                    Password changes and account security options are available
                    in the security settings section.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
