import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  clear: () => void;
  total: number;
}

const STORAGE_KEY = "boutique-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Se o localStorage estiver bloqueado (modo anônimo restrito etc.),
      // o carrinho simplesmente não persiste entre recarregamentos — não é crítico.
    }
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => (prev.some((i) => i.productId === item.productId) ? prev : [...prev, item]));
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function isInCart(productId: string) {
    return items.some((i) => i.productId === productId);
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, isInCart, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart() precisa estar dentro de <CartProvider>.");
  return ctx;
}
