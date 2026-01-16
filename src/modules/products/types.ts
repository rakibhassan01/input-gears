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
  // Technical Specifications for Comparison
  specs?: {
    brand?: string;
    model?: string;
    weight?: string;
    dimensions?: string;
    warranty?: string;
    material?: string;
    connectivity?: string;
    battery?: string;
    features?: string[];
  };
}
