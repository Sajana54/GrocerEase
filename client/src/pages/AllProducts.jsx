import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
/*
const AllProducts = () => {
  // Get products and search query from context
  const { products = [], searchQuery = '' } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter products based on search query
  useEffect(() => {
    if (Array.isArray(products)) {
      if (searchQuery.length > 0) {
        setFilteredProducts(
          products.filter(
            (product) =>
              product.name &&
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredProducts(products);
      }
    } else {
      setFilteredProducts([]);
    }
  }, [products, searchQuery]);

  // Only show in-stock products
  const inStockProducts = filteredProducts.filter(
    (product) => product && product.inStock
  );

  return (
    <div className="mt-14 flex flex-col">
    
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-[#4fbf8b] rounded-full"></div>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6 mt-4">
        {inStockProducts.length > 0 ? (
          inStockProducts.map((product, idx) => (
            <ProductCard
              key={product._id || product.id || `${product.name}-${idx}`}
              product={product}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-40 w-full">
            <p className="text-xl text-gray-400">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
*/
const AllProducts = () => {
  // Get products and search query from context
  const { products = [], searchQuery = '' } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter products based on search query
  useEffect(() => {
    if (Array.isArray(products)) {
      if (searchQuery.length > 0) {
        setFilteredProducts(
          products.filter(
            (product) =>
              product.name &&
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredProducts(products);
      }
    } else {
      setFilteredProducts([]);
    }
  }, [products, searchQuery]);

  // Only show in-stock products
  const inStockProducts = filteredProducts.filter(
    (product) => product && product.inStock
  );

  return (
    <div className="mt-14 flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-end w-max relative">
        <p className="text-2xl font-semibold uppercase text-gray-800">All Products</p>
        <div className="w-16 h-0.5 bg-[#4fbf8b] rounded-full mt-1 transition-all duration-300 group-hover:w-20" />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6 mt-4">
        {inStockProducts.length > 0 ? (
          inStockProducts.map((product, idx) => (
            <div
              key={product._id || product.id || `${product.name}-${idx}`}
              className="transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg rounded-lg"
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-40 w-full">
            <p className="text-xl text-gray-400">No products found.</p>
          </div>
        )}
      </div>
    </div>

  );
};

export default AllProducts;