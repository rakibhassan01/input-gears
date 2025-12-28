export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  // ডেমো অপশনস (কালার/সাইজ)
  colors?: string[];
  sizes?: string[];
}
