import React from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { getUser } from "../lib/auth";

const Home: React.FC = () => {
  const user = getUser();
  const featured = products.slice(0, 4);
  const trending = featured.concat(
    products.slice(4, Math.min(products.length, 8)),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-16">
        <section className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
              Build and ship faster
            </h1>
            <p className="text-gray-300 mb-6">
              Products and starter kits for developers — templates, snippets,
              and guides you can use immediately.
            </p>
            <div className="flex gap-3">
              <Link
                to="/shop"
                className="bg-yellow-500 px-5 py-3 rounded font-semibold"
              >
                Browse Shop
              </Link>
              <a
                href="#docs"
                className="border border-gray-700 px-5 py-3 rounded text-gray-300"
              >
                Docs
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/3 bg-gray-900 p-6 rounded-lg">
            <h4 className="font-bold mb-3">Account</h4>
            {user ? (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Signed in as {user.name || user.email}.
                </p>
                <Link
                  to="/shop"
                  className="bg-yellow-500 px-4 py-2 rounded inline-block"
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
                  className="bg-yellow-500 px-4 py-2 rounded inline-block"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Trending</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map((p) => (
              <div
                key={p.slug}
                className="bg-gray-900 p-4 rounded-lg flex items-start gap-4 hover:shadow-lg transition"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-400">
                    {p.category} • ${p.price}
                  </div>
                </div>
                <div className="text-yellow-400 font-bold">${p.price}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Featured</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        <section id="docs" className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Developer Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 p-4 rounded">
              Get started guides and examples.
            </div>
            <div className="bg-gray-900 p-4 rounded">
              API references and tutorials.
            </div>
            <div className="bg-gray-900 p-4 rounded">
              Community & support channels.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
