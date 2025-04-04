import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { loadStripe } from "@stripe/stripe-js";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51QzEaMEEwnxF6uaXFg88SDeBc2gwYDHPmRvr50njYWLZheM2IhU3jCIC5LMgu0iE3ESsQCZJx4USDXBgr5H0oUUR00eenCOvyw"
);

const ProductDetail = () => {
  const { productId } = useParams();
  const { product, fetchProductById, loading, error } = useProductStore();
  const { user, checkingAuth } = useUserStore();
  const navigate = useNavigate();
  const { addToCart, cart, coupon } = useCartStore();

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId]);

  if ((!product && loading) || checkingAuth) return <LoadingSpinner />;
  if (error)
    return <p className="text-red-500 text-center font-semibold">{error}</p>;

  const handleAddToCart = () => {
    if (!user) {
      toast.error("You need to log in to add items to the cart.");
      return;
    }
    addToCart(product);
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("You need to log in to proceed with checkout.");
      return;
    }

    const stripe = await stripePromise;
    try {
      const res = await axios.post("/payments/create-checkout-session", {
        products: product ? [product] : cart, // If product is provided, process only that product, else process cart
        couponCode: coupon ? coupon.code : null,
        address
      });

      const session = res.data;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Error:", result.error);
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error("An error occurred while processing your payment.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 p-4 sm:p-6 bg-white shadow-lg rounded-lg flex flex-col md:flex-row gap-6 md:gap-8 relative z-10 pb-20">
      <button
        className="absolute top-4 left-4 px-5 py-2 border bg-[#A31621] text-white font-semibold rounded-xl transition duration-300 shadow-lg z-20"
        onClick={() => navigate(-1)}
      >
        &larr;
      </button>
      <div className="w-full md:w-2/5 mt-12 md:mt-0 relative">
        <img
          src={product?.image}
          alt={product?.name}
          className="w-full h-80 sm:h-96 object-cover rounded-lg"
        />
      </div>
      <div className="w-full md:w-3/5">
        <label className="text-gray-600 font-semibold text-lg">
          Product Name:
        </label>
        <h2 className="text-5xl font-extrabold text-[#A31621] mb-4 leading-tight">
          {product?.name}
        </h2>
        <label className="text-gray-600 font-semibold text-lg">Price:</label>
        <p className="text-3xl font-bold text-gray-800 mt-1">
          Rs.{product?.price}
        </p>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          {product?.description}
        </p>
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold">Shipping Information</h3>
          <ul className="list-disc pl-6 text-gray-600">
            <li>
              We dispatch all products within 24-48 hours of placing the order.
            </li>
            <li>
              Post dispatch, delivery may take 1-3 days for metro and 3-6 days
              for non-metro locations.
            </li>
            <li>We ensure the best courier services for your orders.</li>
            <li>Proper packaging prevents in-transit damages.</li>
          </ul>
        </div>
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold">Manufacturing Details</h3>
          <p className="text-gray-600">Manufactured and Marketed By:</p>
          <p className="text-gray-600 font-semibold">
            CookiesMan Private Limited
          </p>
          <p className="text-gray-600">123, Sweet Treats Avenue</p>
          <p className="text-gray-600">Baking City - 400001, Dessert Land</p>
          <p className="text-gray-600">Country of Origin: Cookie Kingdom</p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 px-6 py-3 border border-[#A31621] text-[#A31621] font-semibold rounded-lg hover:bg-[#A31621] hover:text-white transition duration-300"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="inline-block mr-2" /> Add to Cart
          </button>
          <button
            className="flex-1 px-6 py-3 bg-[#A31621] text-white font-semibold rounded-lg hover:opacity-80 transition duration-300"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
