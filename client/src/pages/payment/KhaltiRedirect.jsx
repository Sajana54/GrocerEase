import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const KhaltiRedirect = () => {
  const { axios } = useAppContext();
  const [status, setStatus] = useState("Verifying payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const pidx = new URLSearchParams(window.location.search).get("pidx");

    if (!pidx) {
      setStatus("Invalid payment.");
      return;
    }

    axios
      .post("http://localhost:4000/api/khalti/verify", { pidx })
      .then((res) => {
        const data = res.data;
        if (data.status === "Completed") {
          toast.success("Payment Successful!");
          setStatus("✅ Payment completed.");
          
          // Optional redirect
          setTimeout(() => navigate("/my-orders"), 2000);
        } else {
          toast.error("Payment failed or cancelled.");
          setStatus("❌ Payment not successful.");
        }
      })
      .catch((err) => {
        toast.error("Verification failed");
        setStatus("⚠️ Error verifying payment.");
        console.error(err);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center text-xl">
      {status}
    </div>
  );
};

export default KhaltiRedirect;
