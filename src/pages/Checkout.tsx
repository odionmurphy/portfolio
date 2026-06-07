import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const Checkout: React.FC = () => {
  const { items, remove, clear, total } = useCart();
  const [completed, setCompleted] = useState(false);

  const handlePurchase = () => {
    // Mock purchase flow
    setTimeout(() => setCompleted(true), 600);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Purchase complete</h2>
          <p className="text-gray-300 mb-6">
            Thanks — here are your download links:
          </p>
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.product.slug}>
                <a
                  href={i.product.fileUrl}
                  className="text-yellow-400 underline"
                  download
                >
                  Download {i.product.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <button
              onClick={() => {
                clear();
                setCompleted(false);
              }}
              className="bg-yellow-500 px-4 py-2 rounded"
            >
              Back to shop
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        {items.length === 0 ? (
          <p className="text-gray-300">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((i) => (
              <div
                key={i.product.slug}
                className="flex items-center justify-between bg-gray-900 p-4 rounded"
              >
                <div>
                  <div className="font-bold">{i.product.title}</div>
                  <div className="text-sm text-gray-400">Qty: {i.quantity}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-bold text-yellow-400">
                    ${i.product.price * i.quantity}
                  </div>
                  <button
                    onClick={() => remove(i.product.slug)}
                    className="text-sm text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between mt-4">
              <div className="text-gray-300">Total</div>
              <div className="text-yellow-400 font-bold">${total()}</div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handlePurchase}
                className="bg-yellow-500 px-4 py-2 rounded"
              >
                Complete Purchase (Mock)
              </button>
              <button onClick={clear} className="bg-gray-700 px-4 py-2 rounded">
                Clear
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
