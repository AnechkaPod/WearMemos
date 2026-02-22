import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      // Cart items
      cartItems: [],

      // Checkout data (the item being purchased)
      checkoutData: null,

      // Add item to cart
      addToCart: (item) => set((state) => ({
        cartItems: [...state.cartItems, item]
      })),

      // Remove item from cart by index
      removeFromCart: (index) => set((state) => ({
        cartItems: state.cartItems.filter((_, i) => i !== index)
      })),

      // Update item quantity
      updateQuantity: (index, quantity) => set((state) => ({
        cartItems: state.cartItems.map((item, i) =>
          i === index ? { ...item, quantity } : item
        )
      })),

      // Update item size
      updateSize: (index, size) => set((state) => ({
        cartItems: state.cartItems.map((item, i) =>
          i === index ? { ...item, size } : item
        )
      })),

      // Clear cart
      clearCart: () => set({ cartItems: [] }),

      // Set checkout data (for Buy Now or proceeding to checkout)
      setCheckoutData: (data) => set({ checkoutData: data }),

      // Clear checkout data
      clearCheckoutData: () => set({ checkoutData: null }),

      // Get cart count
      getCartCount: () => {
        const { cartItems } = get();
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Get cart subtotal
      getSubtotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage', // localStorage key
      partialize: (state) => ({
        cartItems: state.cartItems,
        checkoutData: state.checkoutData,
      }),
    }
  )
);

export default useCartStore;
