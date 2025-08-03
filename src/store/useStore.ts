import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firebaseService } from '../services/firebase-service';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  tax: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'cash' | 'card' | 'ewallet';
  customerId?: string;
  customer?: Customer;
  cashierId: string;
  cashierName: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cashier';
  createdAt: Date;
}

// Store interface
interface POSStore {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Products
  products: Product[];
  selectedProduct: Product | null;
  isLoadingProducts: boolean;
  
  // Cart
  cart: CartItem[];
  cartTotal: number;
  cartTax: number;
  cartDiscount: number;
  cartGrandTotal: number;
  
  // Customers
  customers: Customer[];
  selectedCustomer: Customer | null;
  
  // Transactions
  transactions: Transaction[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  
  // Product actions with Firebase integration
  setProducts: (products: Product[]) => void;
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setSelectedProduct: (product: Product | null) => void;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  updateCartItemDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  calculateCartTotals: () => void;
  
  // Customer actions
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  
  // Transaction actions
  addTransaction: (transaction: Transaction) => void;
  setTransactions: (transactions: Transaction[]) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  products: [],
  selectedProduct: null,
  isLoadingProducts: false,
  cart: [],
  cartTotal: 0,
  cartTax: 0,
  cartDiscount: 0,
  cartGrandTotal: 0,
  customers: [],
  selectedCustomer: null,
  transactions: [],
  isLoading: false,
  error: null,
};

// Store
export const useStore = create<POSStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      // Product actions with Firebase integration
      setProducts: (products) => set({ products }),
      
      loadProducts: async () => {
        try {
          set({ isLoadingProducts: true, error: null });
          console.log('🔄 Loading products from Firebase...');
          
          const products = await firebaseService.getProducts();
          console.log(`✅ Loaded ${products.length} products from Firebase`);
          
          set({ products, isLoadingProducts: false });
        } catch (error) {
          console.error('❌ Error loading products:', error);
          set({ 
            isLoadingProducts: false, 
            error: 'Failed to load products from Firebase' 
          });
        }
      },
      
      addProduct: async (productData) => {
        try {
          set({ isLoading: true, error: null });
          console.log('🔄 Adding product to Firebase...', productData);
          
          const newProduct = await firebaseService.addProduct(productData);
          console.log('✅ Product added to Firebase:', newProduct);
          
          set((state) => ({ 
            products: [newProduct, ...state.products],
            isLoading: false 
          }));
        } catch (error) {
          console.error('❌ Error adding product:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to add product to Firebase' 
          });
          throw error; // Re-throw to show error in UI
        }
      },
      
      updateProduct: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          console.log('🔄 Updating product in Firebase...', { id, updates });
          
          await firebaseService.updateProduct(id, updates);
          console.log('✅ Product updated in Firebase:', id);
          
          set((state) => ({
            products: state.products.map(p => 
              p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('❌ Error updating product:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to update product in Firebase' 
          });
          throw error; // Re-throw to show error in UI
        }
      },
      
      deleteProduct: async (id) => {
        try {
          set({ isLoading: true, error: null });
          console.log('🔄 Deleting product from Firebase...', id);
          
          await firebaseService.deleteProduct(id);
          console.log('✅ Product deleted from Firebase:', id);
          
          set((state) => ({
            products: state.products.filter(p => p.id !== id),
            isLoading: false
          }));
        } catch (error) {
          console.error('❌ Error deleting product:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to delete product from Firebase' 
          });
          throw error; // Re-throw to show error in UI
        }
      },
      
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      
      // Cart actions
      addToCart: (product, quantity = 1) => set((state) => {
        const existingItem = state.cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        } else {
          return {
            cart: [...state.cart, { product, quantity, discount: 0 }]
          };
        }
      }),
      
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      
      updateCartItemQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      })),
      
      updateCartItemDiscount: (productId, discount) => set((state) => ({
        cart: state.cart.map(item =>
          item.product.id === productId ? { ...item, discount } : item
        )
      })),
      
      clearCart: () => set({ 
        cart: [], 
        cartTotal: 0, 
        cartTax: 0, 
        cartDiscount: 0, 
        cartGrandTotal: 0 
      }),
      
      calculateCartTotals: () => set((state) => {
        const subtotal = state.cart.reduce((total, item) => {
          const itemTotal = (item.product.price * item.quantity) - item.discount;
          return total + itemTotal;
        }, 0);
        
        const tax = subtotal * 0.11; // 11% tax
        const discount = state.cart.reduce((total, item) => total + item.discount, 0);
        const grandTotal = subtotal + tax - discount;
        
        return {
          cartTotal: subtotal,
          cartTax: tax,
          cartDiscount: discount,
          cartGrandTotal: grandTotal
        };
      }),
      
      // Customer actions
      setCustomers: (customers) => set({ customers }),
      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, customer]
      })),
      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map(c => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      deleteCustomer: (id) => set((state) => ({
        customers: state.customers.filter(c => c.id !== id)
      })),
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      
      // Transaction actions
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),
      setTransactions: (transactions) => set({ transactions }),
      
      // UI actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'pos-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        customers: state.customers,
        transactions: state.transactions,
        // Don't persist products - load from Firebase instead
      }),
    }
  )
); 