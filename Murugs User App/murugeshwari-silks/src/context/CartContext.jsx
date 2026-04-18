import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD ITEM
  const addToCart = (product) => {
  setCart(prevCart => {
    const existing = prevCart.find(item => item.id === product.id);

    if (existing) {
      return prevCart.map(item =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + product.quantity
            }
          : item
      );
    }

    return [...prevCart, product];
  });
};

  // REMOVE ITEM
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // UPDATE QUANTITY
  const updateQty = (id, type) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "inc"
                  ? item.quantity + 1
                  : item.quantity - 1,
            }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty }}
    >
      {children}
    </CartContext.Provider>
  );
};