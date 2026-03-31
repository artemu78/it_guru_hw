import { create } from 'zustand';
import type { IProduct, IProductState, SortKey, SortOrder } from '../types/IProduct';

export const useProductStore = create<IProductState>((set, get) => ({
  products: [],
  loading: false,
  total: 0,
  limit: 30,
  skip: 0,
  search: '',
  sortBy: null,
  order: null,

  fetchProducts: async () => {
    set({ loading: true });
    const { search, sortBy, order, limit, skip } = get();
    
    let url = 'https://dummyjson.com/products';
    if (search) {
      url += `/search?q=${search}`;
    } else {
      url += `?limit=${limit}&skip=${skip}`;
    }

    if (sortBy) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}sortBy=${sortBy}&order=${order || 'asc'}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      set({ 
        products: data.products, 
        total: data.total, 
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ loading: false });
    }
  },

  setSearch: (search: string) => {
    set({ search, skip: 0 });
    get().fetchProducts();
  },

  setSort: (key: SortKey) => {
    const { sortBy, order } = get();
    let newOrder: SortOrder = 'asc';
    
    if (sortBy === key) {
      newOrder = order === 'asc' ? 'desc' : order === 'desc' ? null : 'asc';
    }
    
    set({ sortBy: newOrder ? key : null, order: newOrder });
    get().fetchProducts();
  },

  addProduct: (newProduct: Omit<IProduct, 'id'>) => {
    const { products } = get();
    const product: IProduct = {
      ...newProduct,
      id: Math.max(...products.map(p => p.id), 0) + 1,
    };
    set({ products: [product, ...products] });
  }
}));
