import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

// Helper to parse price string like "₦150,000 / day" to number
const parsePrice = (priceStr) => {
  if (typeof priceStr === "number") return priceStr;
  const match = priceStr?.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (car) => {
    setItems((prev) => {
      // Check if car already in cart
      const exists = prev.find((item) => item.car.name === car.name);
      if (exists) {
        return prev; // Don't add duplicates
      }
      return [...prev, { car, duration: 1 }];
    });
  };

  const removeFromCart = (carName) => {
    setItems((prev) => prev.filter((item) => item.car.name !== carName));
  };

  const updateDuration = (carName, newDuration) => {
    if (newDuration < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.car.name === carName ? { ...item, duration: newDuration } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => setIsOpen((s) => !s);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Calculated values
  const { totalItems, totalAmount } = useMemo(() => {
    const count = items.length;
    const amount = items.reduce((sum, item) => {
      const pricePerDay = parsePrice(item.car.loanPrice || item.car.price);
      return sum + pricePerDay * item.duration;
    }, 0);
    return { totalItems: count, totalAmount: amount };
  }, [items]);

  const value = {
    items,
    isOpen,
    totalItems,
    totalAmount,
    addToCart,
    removeFromCart,
    updateDuration,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
