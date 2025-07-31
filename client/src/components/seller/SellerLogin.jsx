import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate } = useAppContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/seller/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Login successful!");
        setIsSeller(true);
        navigate("/seller");
      } else {
        console.log("Login response data:", data);
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSeller) {
    return null;
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex justify-center items-center text-sm text-gray-600 bg-gray-50"
    >
      <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 w-full max-w-md rounded-lg shadow-xl border border-gray-200 bg-white">
        <h1 className="text-2xl font-medium m-auto">
          <span className="text-[#4fbf8b]">Seller</span> Login
        </h1>

        <div className="w-full">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#4fbf8b] transition-all"
            required
            autoComplete="email"
          />
        </div>

        <div className="w-full">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#4fbf8b] transition-all"
            required
            autoComplete="current-password"
          />
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
                className="mr-2"
              />
              Show Password
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#4fbf8b] text-white py-2 px-4 rounded-md hover:bg-[#3fa57b] transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default SellerLogin;
