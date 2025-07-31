import Navbar from "./components/Navbar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import AddProduct from "./pages/seller/AddProduct";
import KhaltiVerify from "./pages/payment/KhaltiVerify";
import KhaltiRedirect from "./pages/payment/KhaltiRedirect";
import OTPVerification from "./pages/VerifyOTP";


const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <div className={isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/khaltiverify" element={<KhaltiVerify />} />
          <Route path="/khaltiredirect" element={<KhaltiRedirect />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          {/* Seller Routes */}
          {isSeller && (
            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<AddProduct />} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          )}

          {/* Seller Login Route */}
          <Route
            path="/seller-login"
            element={isSeller ? <Navigate to="/seller" /> : <SellerLogin />}
          />

          {/* Unauthorized fallback */}
          {!isSeller && (
            <Route path="/seller/*" element={<Navigate to="/seller-login" />} />
          )}
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
