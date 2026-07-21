import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutTemplate,
  BookOpen,
  Database,
  Terminal,
  Puzzle,
  Package,
  Download,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { products, Product } from "../data/products";
import ProductCard from "../components/ProductCard";
import { getUser } from "../lib/auth";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Templates: LayoutTemplate,
  Guides: BookOpen,
  Data: Database,
  Scripts: Terminal,
  Plugins: Puzzle,
};

function getCategories(items: Product[]) {
  const counts = new Map<string, number>();
  items.forEach((p) => {
    if (!p.category) return;
    counts.set(p.category, (counts.get(p.category) || 0) + 1);
  });
  return Array.from(counts.entries()).map(([name, count]) => ({
    name,
    count,
    Icon: CATEGORY_ICONS[name] || Package,
  }));
}

const VALUE_PROPS = [
  {
    Icon: Download,
    title: "Instant download",
    description: "Get your files right after checkout — no waiting around.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure checkout",
    description: "Your payment details are never stored on our servers.",
  },
  {
    Icon: RefreshCw,
    title: "Free updates",
    description: "Every purchase includes updates for the life of the product.",
  },
];

const Home: React.FC = () => {
  const user = getUser();
  const categories = useMemo(() => getCategories(products), []);
  const popular = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-16">
        {/* Hero */}
        <section className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              New products added every week
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
              Build and ship faster
            </h1>
            <p className="text-gray-300 mb-6 max-w-xl">
              Products and starter kits for developers — templates, snippets,
              and guides you can use immediately.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="bg-yellow-500 hover:bg-yellow-600 transition-colors px-5 py-3 rounded font-semibold"
              >
                Browse Shop
              </Link>
              <a
                href="#categories"
                className="border border-gray-700 hover:border-yellow-500 hover:text-yellow-400 transition-colors px-5 py-3 rounded text-gray-300"
              >
                Browse Categories
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/3 bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h4 className="font-bold mb-3">Account</h4>
            {user ? (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Signed in as {user.name || user.email}.
                </p>
                <Link
                  to="/shop"
                  className="bg-yellow-500 hover:bg-yellow-600 transition-colors px-4 py-2 rounded inline-block"
                >
                  Browse Shop
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Sign in to access purchases and downloads.
                </p>
                <Link
                  to="/signin"
                  className="bg-yellow-500 hover:bg-yellow-600 transition-colors px-4 py-2 rounded inline-block"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="mt-16 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center gap-3 text-center bg-gray-900 border border-gray-800 rounded-xl p-6 h-full transition-all duration-200 hover:-translate-y-1 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center transition-colors group-hover:bg-yellow-500/10">
                    <cat.Icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="font-semibold transition-colors group-hover:text-yellow-400">
                    {cat.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {cat.count} {cat.count === 1 ? "item" : "items"}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular products */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Products</h2>
            <Link
              to="/shop"
              className="text-sm text-yellow-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* Value props */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex items-start gap-4"
            >
              <div className="w-10 h-10 shrink-0 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <v.Icon className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="font-semibold">{v.title}</div>
                <p className="text-sm text-gray-400 mt-1">{v.description}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
