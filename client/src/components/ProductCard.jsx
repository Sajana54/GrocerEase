
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {

  const {
    currency,
    addToCart,
    removeFromCart,
    cartItems,
    navigate,
    user,
    setPostLoginAction,
    setShowUserLogin
  } = useAppContext();

  return product && (
    <div onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0)}}className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-52 max-w-52 w-full">
      <div className="group cursor-pointer flex items-center justify-center px-2">
        <img className="group-hover:scale-105 transition max-w-26 md:max-w-34" src={product.image[0]} alt={product.name} />
      </div>
      <div className="text-gray-500/60 text-sm">
        <p>{product.category}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
        <div className="flex items-center gap-0.5">
         
       
        </div>
        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-medium text-[#4fbf8b]">
            {currency}{product.offerPrice}{" "}
            <span className="text-sm text-gray-500 line-through">{currency}{product.price}</span>
          </p>

          <div onClick= {(e)=>{e.stopPropagation();}}className="text-[#4fbf8b]">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-#4fbf8b border border-[#4fbf8b]-300 md:w-[80px] w-[64px] h-[34px] rounded text-[#4fbf8b]-600 font-medium cursor-pointer"
                onClick={() =>{if (user) addToCart(product._id);
                else {
                  setPostLoginAction(() => () => {
                    addToCart(product._id);
                  });
                  setShowUserLogin(true);
                }
                }}
              >
                <img src={assets.cart_icon} alt="cart_icon" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                <button
                  onClick={() => {if(user)removeFromCart(product._id)}}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{cartItems[product._id]}</span>
                <button
                  onClick={() => {if(user)addToCart(product._id)}}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
