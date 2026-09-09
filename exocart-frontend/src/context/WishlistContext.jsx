import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");

    return savedWishlist
      ? JSON.parse(savedWishlist)
      : [];
  });

  // Save wishlist whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);

  // Add product
  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {

      const alreadyExists = prevItems.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return prevItems;
      }

      return [...prevItems, product];
    });
  };

  // Remove product
  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== productId
      )
    );
  };

  // Toggle product
  const toggleWishlist = (product) => {
    setWishlistItems((prevItems) => {

      const alreadyExists = prevItems.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return prevItems.filter(
          (item) => item.id !== product.id
        );
      }

      return [...prevItems, product];
    });
  };

  // Check whether product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.id === productId
    );
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Wishlist count
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}