import React, { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { products, Product } from "../data/products";
import { Link } from "react-router-dom";
import ProductModal from "../components/ProductModal";

const uniqueCategories = (items: Product[]) => {
  const set = new Set<string>();
  items.forEach((p) => p.category && set.add(p.category));
  return Array.from(set);
};

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = useMemo(() => uniqueCategories(products), []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (
        query &&
        !`${p.title} ${p.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [selectedCategory, query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="bg-gray-900 p-4 rounded-lg sticky top-20">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left ${selectedCategory === null ? "text-yellow-400" : "text-gray-300"}`}
                >
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setSelectedCategory(c)}
                    className={`w-full text-left ${selectedCategory === c ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Search</h4>
              <input
                type="search"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
                placeholder="Search products"
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-sm"
                aria-label="Search products"
              />
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Shop</h1>
            <div className="flex items-center gap-3">
              <input
                type="search"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
                placeholder="Search"
                className="bg-gray-800 border border-gray-700 px-3 py-2 rounded text-sm"
                aria-label="Search products"
              />

              <Link to="/checkout" className="bg-yellow-500 px-4 py-2 rounded">
                Checkout
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard
                key={p.slug}
                product={p}
                onOpen={setSelectedProduct}
              />
            ))}
          </div>
        </section>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Shop;
