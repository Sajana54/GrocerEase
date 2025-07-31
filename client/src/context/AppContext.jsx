import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});
  const [postLoginAction, setPostLoginAction] = useState(null);

  //fetch user auth status, user data and cart items

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      } else {
        setCartItems({});
      }
    } catch {
      setUser(null);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [user?.name]);
  //fetch seller status

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch {
      setIsSeller(false);
    }
  };

  // Load products (placeholder for API)
  // const fetchProducts = async () => {
  //   try {
  //     const { data } = await axios.get("/api/product/list?includeAll=true");
  //     if (data.success) {
  //       setProducts(data.products);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  const fetchProducts = async () => {
    try {
      const endpoint = isSeller
        ? "/api/product/list?includeAll=true"
        : "/api/product/list"; // only in-stock for users

      const { data } = await axios.get(endpoint);
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add item to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("Item added to cart!");
  };

  // Update item quantity directly
  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    if (quantity > 0) {
      cartData[itemId] = quantity;
    } else {
      delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Cart updated!");
  };

  // Remove one quantity from cart
  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }
      setCartItems(cartData);
      toast.success("Item removed from cart");
    } else {
      toast.error("Item not in cart");
    }
  };
  //Get cart items counted
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  //get cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId); // Fix 1: use _id instead of id
      if (itemInfo && cartItems[itemId] > 0) {
        // Fix 2: check if itemInfo exists
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  //update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    postLoginAction,
    setPostLoginAction,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    fetchProducts,
    setCartItems,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
