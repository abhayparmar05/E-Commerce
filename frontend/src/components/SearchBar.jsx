import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useProductStore } from "../stores/useProductStore.js";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const { getAllProductsForSearch, products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      getAllProductsForSearch().then(() => {
        setFilteredProducts(
          products.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      });
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, getAllProductsForSearch, products]);

  const handleProductClick = (productId) => {
    setSearchQuery("");
    setFilteredProducts([]);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="relative w-[30vw]">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A31621]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={() => setTimeout(() => setFilteredProducts([]), 200)}
      />
      <Search className="absolute right-3 top-2 text-gray-500" size={20} />

      {filteredProducts.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
