export interface ShopLogo {
  url: string;
  filename?: string;
}

export interface Shop {
  _id?: string;
  shopName: string;
  owner: string;
  ownerName: string;
  email: string;
  phone: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessHours?: string;
  categories?: string[];
  logo?: ShopLogo;
  location: {
    lat: number;
    lng: number;
  };
  isApproved: boolean;
  createdAt: Date;
}
