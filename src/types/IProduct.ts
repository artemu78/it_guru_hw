export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  sku?: string; // Vendor/sku from blueprint
  vendor?: string;
}

export type SortOrder = 'asc' | 'desc' | null;
export type SortKey = 'price' | 'rating' | 'title';

export interface IProductState {
  products: IProduct[];
  loading: boolean;
  total: number;
  limit: number;
  skip: number;
  search: string;
  sortBy: SortKey | null;
  order: SortOrder;
  
  fetchProducts: () => Promise<void>;
  setSearch: (search: string) => void;
  setSort: (key: SortKey) => void;
  addProduct: (product: Omit<IProduct, 'id'>) => void;
}
