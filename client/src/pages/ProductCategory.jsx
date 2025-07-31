import { useParams } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { categories } from "../assets/assets"
import ProductCard from "../components/ProductCard"

const ProductCategory = () => {
  const { products } = useAppContext()
  const { category } = useParams()

  // Find the category object (case-insensitive)
  const searchCategory = categories.find(
    item => item.path.toLowerCase() === category?.toLowerCase()
  )
const normalizedCategory = searchCategory?.text.toLowerCase() || "";

const filteredProducts = products.filter((product) => {
  if (!product.category) return false;
  return product.category.toLowerCase() === normalizedCategory;
});


  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">{searchCategory.text.toUpperCase()}</p>
          <div className="w-16 h-0.5 bg-[#4fbf8b] rounded-full"></div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6 mt-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-[#4fbf8b]">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductCategory

