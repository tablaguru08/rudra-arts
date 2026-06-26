import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true); // 🔥 New

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    console.log("💾 Loaded from localStorage:", savedCart);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsCartLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const normalizedProduct = {
      ...product,
      _id: String(product._id ?? product.id ?? ""),
      product_name: product.product_name || product.name || "",
      product_price: Number(product.product_price ?? product.price) || 0,
      product_size: product.product_size || product.size || "0",
      product_description:
        product.product_description || product.description || "",
      product_category:
        product.product_category || product.category || "Uncategorized",
      product_image: Array.isArray(product.product_image)
        ? product.product_image
        : [],
    };
    const exists = cartItems.find(
      (item) => String(item._id) === normalizedProduct._id
    );
    if (!exists) setCartItems([...cartItems, normalizedProduct]);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => String(item._id) !== String(id));
    setCartItems(updated);
  };

  const clearCart = () => {
    setCartItems([]); // or however you're managing state
  };

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item._id) === String(id)
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item._id) === String(id)
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        removeFromCart,
        isCartLoading,
        increaseQuantity,
        decreaseQuantity,
      }} // ✅ pass flag
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
