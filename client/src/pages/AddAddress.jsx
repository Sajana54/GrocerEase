import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

// Reusable Input Field component
const InputField = ({
  type = "text",
  placeholder,
  name,
  handleChange,
  address,
}) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-[#4fbf8b] transition"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    zipcode: "",
    province: "",
    country: "Nepal",
    street: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/address/add",
        { address }
        // { withCredentials: true }
      ); /*api end point maa address send gareko through state*/
      if (data.success) {
        toast.success(data.message);
        navigate(
          "/cart"
        ); /*user will be navigated to cart page due to this function*/
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  /*address update garesi cart bhanne page maa redirect garaucha*/
  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, []);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping{" "}
        <span className="font-semibold text-[#4fbf8b]">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                placeholder="Last Name"
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              placeholder="Email Address"
              type="email"
            />

            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              placeholder="Phone Number"
              type="tel"
            />

            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              placeholder="Street Address"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-[#4fbf8b] transition"
                name="city"
                value={address.city}
                onChange={handleChange}
                required
              >
                <option value="">Select District</option>
                {[
                  "Achham",
                  "Arghakhanchi",
                  "Baglung",
                  "Baitadi",
                  "Bajhang",
                  "Bajura",
                  "Banke",
                  "Bara",
                  "Bardiya",
                  "Bhaktapur",
                  "Bhojpur",
                  "Chitwan",
                  "Dadeldhura",
                  "Dailekh",
                  "Dang",
                  "Darchula",
                  "Dhading",
                  "Dhankuta",
                  "Dhanusa",
                  "Dholkha",
                  "Dolpa",
                  "Doti",
                  "Eastern Rukum",
                  "Gorkha",
                  "Gulmi",
                  "Humla",
                  "Ilam",
                  "Jajarkot",
                  "Jhapa",
                  "Jumla",
                  "Kailali",
                  "Kalikot",
                  "Kanchanpur",
                  "Kapilvastu",
                  "Kaski",
                  "Kathmandu",
                  "Kavrepalanchok",
                  "Khotang",
                  "Lalitpur",
                  "Lamjung",
                  "Mahottari",
                  "Makwanpur",
                  "Manang",
                  "Morang",
                  "Mugu",
                  "Mustang",
                  "Myagdi",
                  "Nawalpur",
                  "Nuwakot",
                  "Okhaldhunga",
                  "Palpa",
                  "Panchthar",
                  "Parbat",
                  "Parsa",
                  "Pyuthan",
                  "Ramechhap",
                  "Rasuwa",
                  "Rautahat",
                  "Rolpa",
                  "Rupandehi",
                  "Salyan",
                  "Sankhuwasabha",
                  "Saptari",
                  "Sarlahi",
                  "Sindhuli",
                  "Sindhupalchok",
                  "Siraha",
                  "Solukhumbu",
                  "Sunsari",
                  "Surkhet",
                  "Tanahun",
                  "Taplejung",
                  "Terhathum",
                  "Udayapur",
                  "Western Rukum",
                ].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              <InputField
                handleChange={handleChange}
                address={address}
                name="zipcode"
                placeholder="Zip Code"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-[#4fbf8b] transition"
                name="province"
                value={address.province}
                onChange={handleChange}
                required
              >
                <option value="">Select Province</option>
                <option value="Koshi Province">Koshi Province </option>
                <option value="Madhesh Province">Madhesh Province</option>
                <option value="Bagmati Province">Bagmati Province</option>
                <option value="Gandaki Province">Gandaki Province</option>
                <option value="Lumbini Province">Lumbini Province</option>
                <option value="Karnali Province">Karnali Province</option>
                <option value="Sudurpashchim Province">
                  Sudurpashchim Province
                </option>
              </select>

              <input
                type="text"
                name="country"
                value="Nepal"
                readOnly
                style={{
                  backgroundColor: "rgba(240, 240, 240, 0.25)",
                  cursor: "not-allowed",
                }}
              />
            </div>

            <button
              type="submit"
              className="mt-5 w-full bg-[#4fbf8b] text-white py-2 rounded hover:bg-[#3ba478] transition"
            >
              Save Address
            </button>
          </form>
        </div>

        <img
          className="md:mr-16 mb-16 mt-0 w-full max-w-sm"
          src={assets.add_address_iamge}
          alt="Add Address Illustration"
        />
      </div>
    </div>
  );
};

export default AddAddress;
