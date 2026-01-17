export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  colors?: string[];
  switchType?: string;

  // New Technical Specifications
  brand?: string | null;
  sku?: string | null;
  dpi?: string | null;
  weight?: string | null;
  connectionType?: string | null;
  pollingRate?: string | null;
  sensor?: string | null;
  warranty?: string | null;
  availability?: string | null;

  // Technical Specifications for Comparison
  specs?: Record<string, string | number | boolean | null>;
  image?: string | null;
}
