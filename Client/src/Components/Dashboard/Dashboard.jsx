import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Box,
  Check,
  Edit,
  Newspaper,
  Paperclip,
  Plus,
  Settings,
  UserCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [checkoutCount, setCheckoutCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const cards = [
    { Icon: Plus, label: "Add Products", to: "/admin/add-products" },
    { Icon: Box, label: "Product", to: "/admin/products" },
    { Icon: Newspaper, label: "News", to: "/admin/news" },
    { Icon: Edit, label: "Blogs", to: "/admin/blog" },
    { Icon: Check, label: "Blog Checker", to: "/admin/blog-checker" },
    { Icon: Truck, label: "COD Orders", to: "/admin/orders" },
  ];

  // Fetch checkout stats on mount
  useEffect(() => {
    const fetchCheckoutStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL_PRODUCTION}/api/checkout/count`
        );
        const data = await res.json();
        setCheckoutCount(data.total || 0);
      } catch (err) {
        console.error("Failed to load checkout count:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckoutStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-[#8C391B] font-outfit">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0 pointer-events-none" />
        <div className="absolute -top-20 -left-32 w-[300px] h-[300px] bg-orange-500/30 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute -bottom-20 -right-32 w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-2xl z-0 animate-pulse" />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 text-white"
        >
          <motion.h1
            className="text-4xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            Welcome to your Admin Dashboard
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage everything with elegance, precision, and control. Your
            dashboard awaits.
          </motion.p>

          {/* Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mt-8">
            {cards.map(({ Icon, label, to }, index) => (
              <Link to={to} key={label} className="group">
                <motion.div
                  className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-xl shadow-xl hover:scale-105 transition transform duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                >
                  <Icon className="w-8 h-8 text-white mx-auto mb-3 group-hover:scale-110 transition" />
                  <p className="text-white font-semibold">{label}</p>
                </motion.div>
              </Link>
            ))}

            {/* Checkout Status Card */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-xl shadow-xl hover:scale-105 transition transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + cards.length * 0.2 }}
            >
              <ShoppingCart className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-white font-semibold">Checkouts</p>
              <p className="text-white text-lg mt-1 font-bold">
                {isLoading ? "Loading..." : checkoutCount}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
