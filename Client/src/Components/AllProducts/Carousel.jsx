"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchCachedJson } from "../../lib/api";
import { getOptimizedImage } from "../../lib/media";

const normalizeProduct = (product) => ({
  ...product,
  _id: String(product._id ?? product.id ?? ""),
  product_name: product.product_name || product.name || "",
  product_price: Number(product.product_price ?? product.price) || 0,
  product_image:
    Array.isArray(product.product_image) && product.product_image.length > 0
      ? product.product_image
      : ["/placeholder-image.jpg"],
});

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const data = await fetchCachedJson("/api/products", {
          cacheKey: "products:list",
          ttlMs: 5 * 60 * 1000,
        });
        const productsData = Array.isArray(data)
          ? data
          : data?.products || data?.data || [];
        const sortedProducts = productsData
          .map(normalizeProduct)
          .sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
        setProducts(sortedProducts.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchLatestProducts();
  }, []);

  if (!products.length) return null;

  return (
    <div className="w-full py-12 bg-transparent">
      <h2 className="text-3xl font-normal font-times text-customBrown mb-8 px-8 pt-5">
        Latest Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-8">
        {products.map((product) => (
          <motion.div
            key={product._id}
            className="relative cursor-pointer"
            onClick={() => navigate(`/product-details/${product._id}`)}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative overflow-hidden bg-white shadow-md">
              <img
                src={
                  getOptimizedImage(product.product_image?.[0], "card") ||
                  "/placeholder-image.jpg"
                }
                loading="lazy"
                alt={product.product_name || "Product"}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                  {product.product_name}
                </h3>
                <p className="text-orange-500 font-bold text-lg">
                  ₹{product.product_price.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                New
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
