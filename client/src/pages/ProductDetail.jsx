import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from '../context/AppContext';
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
    const {
      products,
      navigate,
      currency,
      addToCart,
      user,
      setShowUserLogin,
      setPostLoginAction
    } = useAppContext();
    const { id } = useParams();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    useEffect(() => {
        if (products.length > 0 && product) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => product.category === item.category && item._id !== id);
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product, id]);

    useEffect(() => {
        setThumbnail(product?.image?.[0] ?? null);
    }, [product]);

    if (!product) {
        return (
            <div className="mt-20 text-center text-xl text-gray-500">
                Product not found.
            </div>
        );
    }

    return (
        <div className="mt-12 px-4">
            {/* Breadcrumb */}
            <p className="mb-4 text-sm text-gray-600">
                <Link to="/" className="hover:underline">Home</Link> /
                <Link to="/products" className="hover:underline"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:underline"> {product.category}</Link> /
                <span className="text-[#44ae7c]"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                {/* Left: Images */}
                <div className="flex gap-4">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-4">
                        {product.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setThumbnail(image)}
                                className={`border border-gray-300 rounded cursor-pointer p-1 ${thumbnail === image ? 'ring-2 ring-indigo-400' : ''}`}
                            >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-16 h-16 object-cover" />
                            </div>
                        ))}
                    </div>
                    {/* Main Image */}
                    <div className="border border-gray-300 rounded overflow-hidden w-[400px] h-[400px] bg-white flex items-center justify-center">
                        <img src={thumbnail} alt="Selected product" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-medium mb-4">{product.name}</h1>

                    <div className="mb-4">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>

                        <p className="text-2xl font-semibold text-[#4fbf8b]">MRP: {currency}{product.offerPrice}</p>
                        <p className="text-sm text-gray-500/70">(inclusive of all taxes)</p>
                    </div>

                    <p className="text-base font-medium mt-6 mb-2">About Product</p>
                    <ul className="list-disc ml-5 text-gray-600 space-y-1">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                            onClick={() =>{
                                if (user) {
                                  addToCart(product._id);
                                } else {
                                    setPostLoginAction(() => () => {
                                      addToCart(product._id);
                                    });
                                  setShowUserLogin(true); 
                                }
                                
                            }}
                            className="flex-1 py-3 bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => {
                                if (user) {
                                  addToCart(product._id);
                                  navigate('/cart')
                                } else {
                                     setPostLoginAction(() => () => {
                                       addToCart(product._id);
                                       navigate("/cart");
                                     });
                                  setShowUserLogin(true); // trigger login modal
                                }
                            }}
                            className="flex-1 py-3 bg-[#4fbf8b] text-white font-medium hover:bg-[#44ae7c] transition"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/*.........Related Products........*/}
      
<div className="flex flex-col items-center mt-20 w-full">
  {/* Heading */}
  <div className="flex flex-col items-center w-max">
    <p className="text-3xl font-medium">Related Products</p>
    <div className="w-20 h-0.5 bg-[#4fbf8b] rounded-full mt-3"></div>
  </div>

  {/* Products Grid */}
 <div className="w-full grid gap-4 md:gap-6 mt-6" style={{
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
}}>
    {relatedProducts
      .filter((product) => product.inStock)
      .map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
  </div>

  {/* See More Button */}
  <button
    onClick={() => {
      navigate('/products');
      scrollTo(0, 0);
    }}
    className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-[#4fbf8b] hover:bg-[#4fbf8b] hover:text-white transition"
  >
    See more
  </button>
</div>
</div>

       
    );
};

export default ProductDetails;
