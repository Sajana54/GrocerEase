import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const KhaltiVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { axios, cartItems, user, setCartItems } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [hasVerified, setHasVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search);
  const pidx = query.get("pidx");

  // Always run hooks — no early return above this

  // Fetch user address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axios.get("/api/address/get");
        if (data.success && data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        } else {
          toast.error("No address found");
          navigate("/cart");
        }
      } catch (error) {
        toast.error("Failed to fetch address");
        navigate("/cart");
      }
    };

    fetchAddress();
  }, []);

  // Verify payment once everything is ready
  useEffect(() => {
    const verifyKhalti = async () => {
      if (
        hasVerified ||
        !pidx ||
        !user ||
        !selectedAddress ||
        !Object.keys(cartItems).length
      ) {
        return;
      }

      setHasVerified(true);

      const items = Object.keys(cartItems).map((productId) => ({
        product: productId,
        quantity: cartItems[productId],
      }));

      try {
        const { data } = await axios.post("/api/khalti/verify", {
          pidx,
          items,
          address: selectedAddress._id,
          userId: user._id,
        });

        if (data.success) {
          toast.success("Payment Verified ✅ Order Placed");
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message || "Payment failed");
          navigate("/cart");
        }
      } catch (error) {
        toast.error("Verification failed");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    verifyKhalti();
  }, [pidx, selectedAddress, user, cartItems, hasVerified]);

  //  Final render (always run after hooks)
  return (
    <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-gray-700">
      {loading ? "Verifying your payment..." : "Redirecting..."}
    </div>
  );
};

export default KhaltiVerify;
