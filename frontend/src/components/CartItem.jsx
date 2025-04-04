import { useState } from "react";
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity) => {
    setIsUpdating(true); // Disable buttons while updating
    await updateQuantity(item._id, newQuantity);
    setIsUpdating(false); // Re-enable buttons after update
  };

  return (
    <div className="rounded-lg border border-red-500/30 p-4 shadow-sm bg-transparent md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img
            className="w-40 h-40 md:w-32 md:h-32 rounded object-cover"
            src={item.image}
          />
        </div>

        <label className="sr-only">Choose quantity:</label>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center text-[#A31621] justify-center rounded-md border
                focus:outline-none focus:ring-2 disabled:opacity-50"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isUpdating}
            >
              <Minus className="text-[#A31621]" />
            </button>

            <p>{item.quantity}</p>

            <button
              className="inline-flex h-5 w-5 shrink-0 items-center text-[#A31621] justify-center rounded-md border
                focus:outline-none focus:ring-2 disabled:opacity-50"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating}
            >
              <Plus className="text-[#A31621]" />
            </button>
          </div>

          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold">Rs.{item.price}</p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p className="text-base font-medium hover:underline">{item.name}</p>
          <p className="text-sm">{item.description}</p>

          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center text-sm font-medium 
                hover:text-red-500 hover:underline"
              onClick={() => removeFromCart(item._id)}
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
