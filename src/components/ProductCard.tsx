import React from "react";
import { Product } from "../data/products";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
  onOpen?: (p: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onOpen }) => {
  const { add } = useCart();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen?.(product);
      }}
      aria-label={`View ${product.title} details`}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-44 object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold">{product.title}</h3>
        <p className="text-gray-300 mt-2 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="text-yellow-400 font-bold">${product.price}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              add(product);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-medium"
            aria-label={`Add ${product.title} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
