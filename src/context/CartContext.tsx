import React, { createContext, useContext, useState } from "react";
import { Product } from "../data/products";

type CartItem = { product: Product; quantity: number };

type CartContextType = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
  total: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (product: Product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.slug === product.slug);
      if (found)
        return prev.map((i) =>
          i.product.slug === product.slug
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      return [...prev, { product, quantity: 1 }];
    });
  };

  const remove = (slug: string) => {
    setItems((prev) => prev.filter((i) => i.product.slug !== slug));
  };

  const clear = () => setItems([]);

  const total = () =>
    items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
