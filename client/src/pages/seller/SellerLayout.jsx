import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const {  axios, navigate,setIsSeller } = useAppContext();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try{
      setIsSeller(false);
const {data} = await axios.get('/api/seller/logout');
if (data.success) {
  toast.success(data.message)
    setIsSeller(false);
   navigate('/')
}else{
  toast.error(data.message)
}
    }catch(error)
{
toast.error(error.message)
}  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="cursor-pointer w-32 md:w-38" />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button onClick={logout} className="border rounded-full text-sm px-4 py-1">
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[95vh] border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((itemx) => (
            <NavLink
              to={itemx.path}
              key={itemx.name}
              end={itemx.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-[#4fbf8b]/10 border-[#4fbf8b] text-[#4fbf8b]"
                    : "hover:bg-gray-100/90 border-white"
                }`
              }
            >
              <img src={itemx.icon} alt="" className="w-7 h-7" />
              <p className="md:block hidden">{itemx.name}</p>
            </NavLink>
          ))}
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SellerLayout;
