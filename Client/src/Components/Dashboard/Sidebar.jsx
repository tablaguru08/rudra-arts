"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Settings,
  Menu,
  ChevronLeft,
  Newspaper,
  FileText,
  PenLine,
  Edit3,
  ClipboardList,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBlog } from "react-icons/fa";
import { Add, CheckBox, CheckCircleRounded } from "@mui/icons-material";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      to: "/admin/dashboard",
    },
    {
      label: "Products",
      icon: <Box size={20} />,
      to: "/admin/products",
    },
    {
      label: "News Manager",
      icon: <Newspaper size={20} />,
      to: "/admin/news-manager",
    },
    {
      label: "Blog Manager",
      icon: <CheckBox size={20} />,
      to: "/admin/blog-manager",
    },
    {
      label: "Blog Checker",
      icon: <ClipboardList size={20} />,
      to: "/admin/blog-checker",
    },
    {
      label: "COD Orders",
      icon: <Truck size={20} />,
      to: "/admin/orders",
    },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-gray-900 text-white shadow-lg fixed top-0 left-0 z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-lg font-bold"
            >
              Admin Panel
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-6 space-y-1">
        {menuItems.map(({ label, icon, to }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-gray-800 text-yellow-400"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mr-3"
              >
                {icon}
              </motion.div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
