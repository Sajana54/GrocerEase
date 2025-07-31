import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
    setPostLoginAction,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-17 w-32" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/" className="hover:text-primary">
          Home
        </NavLink>
        <NavLink to="/products" className="hover:text-primary">
          All Product
        </NavLink>
        <NavLink to="/contact" className="hover:text-primary">
          Contact
        </NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4 h-4 cursor-pointer"
          />
        </div>

        <div
          onClick={() => {
            if (user) navigate("/cart");
            else {
              setPostLoginAction(() => () => {
                navigate("/cart");
              });
              setShowUserLogin(true);
            }
          }}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-[#4fbf8b] w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer px-6 py-2 bg-[#4fbf8e] hover:bg-[#44ae7c] transition text-white rounded-full"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/seller-login")}
              className="cursor-pointer px-6 py-2 bg-[#4fbf8e] hover:bg-[#44ae7c] transition text-white rounded-full"
            >
              Seller Login
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src={user?.avatar || assets.profile_icon}
                className="w-10 h-10 rounded-full object-cover"
                alt=""
              />
              <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                <li
                  onClick={() => navigate("my-orders")}
                  className="p-1.5 pl-3 hover:bg-[#4fbf8b]/10 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="p-1.5 pl-3 hover:bg-[#4fbf8b]/10 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate("/seller-login")}
              className="cursor-pointer px-6 py-2 bg-[#4fbf8e] hover:bg-[#44ae7c] transition text-white rounded-full"
            >
              Seller Login
            </button>
          </div>
        )}
      </div>

      {/* Menu Toggle Button */}
      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-[#4fbf8b] w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
      </div>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <img src={assets.menu_icon} alt="menu" />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Products
          </NavLink>
          {user && (
            <NavLink to="/products" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {!user ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowUserLogin(true)}
                className="cursor-pointer px-6 py-2 bg-[#4fbf8e] hover:bg-[#44ae7c] transition text-white rounded-full"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/seller-login")}
                className="cursor-pointer px-6 py-2 bg-[#ffb347] hover:bg-[#ffaa33] transition text-white rounded-full"
              >
                Seller Login
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img src={assets.profile_icon} className="w-10" alt="" />
                <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                  <li
                    onClick={() => navigate("my-orders")}
                    className="p-1.5 pl-3 hover:bg-[#4fbf8b]/10 cursor-pointer"
                  >
                    My Orders
                  </li>
                  <li
                    onClick={logout}
                    className="p-1.5 pl-3 hover:bg-[#4fbf8b]/10 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate("/seller-login")}
                className="cursor-pointer px-6 py-2 bg-[#4fbf8e] hover:bg-[#44ae7c] transition text-white rounded-full"
              >
                Seller Login
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
