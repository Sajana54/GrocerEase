
/*
import { useAppContext } from "../context/AppContext"
import ProductCard from "./ProductCard"


const BestSeller = () => {
    const {products} = useAppContext();
    return (
        <div className='mt-16'>
            <p className='text-2xl md:text-3xl font-medium'> Best Sellers</p>
           <div className='flex overflow-x-auto mt-6 gap-6'></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-colos-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
                {products.filter((product)=>product.inStock).slice(0,5).map((product,index)=>(
                    <ProductCard key={index} product={product}/>
                ))}
              
            </div>
        </div>
    )
}

export default BestSeller
*/
import { useAppContext } from "../context/AppContext"
import ProductCard from "./ProductCard"

const BestSeller = () => {
    const { products } = useAppContext();

    return (
        <div className='mt-16'>
            {/* Section Header with animated underline */}
            <div className='flex flex-col items-start'>
                <p className='text-2xl md:text-3xl font-semibold text-gray-800'>Best Sellers</p>
                <div className='w-16 h-1 bg-[#4fbf8b] mt-1 rounded-full'></div>
            </div>

            {/* Placeholder for horizontal scroll (if needed later) */}
            <div className='flex overflow-x-auto mt-6 gap-6'></div>

            {/* Product Grid with hover effect wrapper */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
                {products
                    .filter((product) => product.inStock)
                    .slice(0, 5)
                    .map((product, index) => (
                        <div
                            key={index}
                            className="transition-transform duration-300 hover:scale-[1.03] hover:shadow-md rounded-lg"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default BestSeller;
