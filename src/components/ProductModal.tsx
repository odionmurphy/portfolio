import React from "react";
import { motion } from "framer-motion";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ProductModal: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const { add } = useCart();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 mx-4"
        variants={modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-6">
          <img
            src={product.image}
            alt={product.title}
            className="w-48 h-32 object-cover rounded"
          />

          <div className="flex-1">
            <h3 className="text-2xl font-bold">{product.title}</h3>
            <p className="text-gray-300 mt-2">{product.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-yellow-400 font-bold text-xl">
                ${product.price}
              </div>
              <button
                onClick={() => add(product)}
                className="bg-yellow-500 px-4 py-2 rounded"
              >
                Add to cart
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700 px-3 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductModal;
