export interface ShopLogo {
  url: string;
  filename?: string;
}

export interface Shop {
  id?: string;
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
  isApproved: boolean;
  createdAt: Date;
}
