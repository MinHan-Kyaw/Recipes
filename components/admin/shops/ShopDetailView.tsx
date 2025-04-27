import {
  User,
  Mail,
  Phone,
  Home,
  Globe,
  Clock,
  Tag,
  FileText,
  Map,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ShopStatusBadge from "./ShopStatusBadge";
import { Shop } from "@/lib/types/shop";

interface ShopDetailViewProps {
  shop: Shop;
  formatDate: (date: string | Date) => string;
}

export default function ShopDetailView({
  shop,
  formatDate,
}: ShopDetailViewProps) {
  // Get shop logo initials
  const getShopInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={shop.logo?.url || ""} alt={shop.shopName} />
              <AvatarFallback className="text-lg">
                {getShopInitials(shop.shopName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{shop.shopName}</h3>
              <p className="text-sm text-gray-500">
                <ShopStatusBadge isApproved={shop.isApproved} />
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">{shop.description}</p>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Owner</p>
                <p className="text-sm text-gray-600">{shop.ownerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{shop.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-gray-600">{shop.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {shop.categories?.map((category) => (
              <Badge key={category} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Location</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Home className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-gray-600">{shop.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">City, State, ZIP</p>
                <p className="text-sm text-gray-600">
                  {shop.city}, {shop.state} {shop.zipCode}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Country</p>
                <p className="text-sm text-gray-600">{shop.country}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Business Hours</p>
                <p className="text-sm text-gray-600">{shop.businessHours}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Shop Stats</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Recipes</p>
                <p className="text-sm text-gray-600">
                  {shop.recipesCount || 0} recipes published
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-gray-600">
                  {formatDate(shop.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="md:col-span-2 mt-2">
        <Card>
          <CardContent className="p-4">
            <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center">
              <Map className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-gray-500">
                Map view at {shop.location?.lat.toFixed(4)},{" "}
                {shop.location?.lng.toFixed(4)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
