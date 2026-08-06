export type ProductStatus = "disponivel" | "reservado" | "vendido";
export type ProductCondition = "novo" | "seminovo" | "usado";
export type ReviewStatus = "pendente" | "aprovada" | "rejeitada";

export interface Store {
  $id: string;
  ownerId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  address?: string;
  city?: string;
  businessHours?: string;
}

export interface Category {
  $id: string;
  storeId: string;
  name: string;
  slug: string;
  position: number;
}

export interface Product {
  $id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  color?: string;
  brand?: string;
  size?: string;
  condition: ProductCondition;
  quantity: number;
  status: ProductStatus;
}

export interface ProductImage {
  $id: string;
  productId: string;
  url: string;
  position: number;
}

export interface Look {
  $id: string;
  storeId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
}

export interface LookItem {
  $id: string;
  lookId: string;
  productId: string;
  position: number;
}

export interface Review {
  $id: string;
  storeId: string;
  customerName: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
}

export interface Sale {
  $id: string;
  storeId: string;
  productId: string;
  productName: string;
  categoryId?: string;
  categoryName?: string;
  price: number;
  soldAt: string; // ISO datetime
}
