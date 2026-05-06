import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiArrowRight,
  FiCalendar,
  FiUser,
  FiPlus,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import bg from "../../assets/images/about-bg.jpg";
import AnimatedUnderline from "../AnimatedUnderline/AnimatedUnderline";
import { fetchCachedJson } from "../../lib/api";
import { getOptimizedImage } from "../../lib/media";

const Blogs = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    author: "",
    image: null,
    previewImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCachedJson("/api/blogs/all?status=approved", {
        cacheKey: "blogs:approved",
        ttlMs: 5 * 60 * 1000,
      });
      setBlogs(data.reverse());
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  console.log(blogs);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBlog({
          ...newBlog,
          image: file,
          previewImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitBlog = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", newBlog.title);
      formData.append("content", newBlog.content);
      formData.append("author", newBlog.author);
      if (newBlog.image) formData.append("image", newBlog.image);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BASE_URL_PRODUCTION}/api/blogs/submit`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Failed to submit blog");

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setOpenModal(false);
        setNewBlog({
          title: "",
          content: "",
          author: "",
          image: null,
          previewImage: null,
        });
        fetchBlogs();
      }, 2000);
    } catch (error) {
      console.error("Error submitting blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExcerpt = (text, charLimit = 150) => {
    if (!text) return "";
    if (text.length <= charLimit) return text;
    return text.substring(0, charLimit).trim() + "...";
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      !blog.isHidden &&
      (!searchTerm ||
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.author &&
          blog.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.tags &&
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )))
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 font-times pt-10">
      {/* Background Texture */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Create Blog Button */}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-amber-900 mb-6 leading-tight">
              <AnimatedUnderline>The Cultural Roots Blog</AnimatedUnderline>
            </h1>
            <p className="text-lg md:text-xl text-amber-800 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover the world of traditional craftsmanship and stories behind
              each masterpiece.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto relative flex items-center gap-4"
            >
              {/* Search Input with Icon */}
              <div className="relative flex-grow">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
                <input
                  type="text"
                  placeholder="Search blogs by title, content or author..."
                  className="w-full pl-12 pr-10 py-4 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 text-amber-900 placeholder-amber-400 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              {/* Create Blog Button */}
              <button
                onClick={() => setOpenModal(true)}
                className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition"
              >
                <FiPlus /> Create Blog
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="h-48 bg-amber-100 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-amber-100 rounded animate-pulse mb-4 w-3/4"></div>
                  <div className="h-4 bg-amber-100 rounded animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-amber-100 rounded animate-pulse mb-2 w-5/6"></div>
                  <div className="h-4 bg-amber-100 rounded animate-pulse mb-6 w-2/3"></div>
                  <div className="h-10 bg-amber-100 rounded animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-amber-100 transition-all duration-300 hover:shadow-lg"
                >
                  <Link to={`/blogs/${blog._id}`} className="block h-full">
                    <div className="relative h-48 overflow-hidden">
                      {blog.image ? (
                          <img
                          src={getOptimizedImage(blog.image, "blog")}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-400">
                          No Image Available
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-3 text-sm text-amber-600 mb-3">
                        <div className="flex items-center gap-1">
                          <FiCalendar />
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiUser />
                          <span>{blog.author || "Anonymous"}</span>
                        </div>
                      </div>

                      <h3
                        className="text-xl font-yatra font-normal text-amber-900 mb-3 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(blog.title),
                        }}
                      />

                      <p
                        className="text-amber-700 font-yatra fonr-normal mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(
                            getExcerpt(blog.content, 200)
                          ),
                        }}
                      />

                      <div className="mt-auto flex justify-end">
                        <div className="flex items-center gap-1 text-amber-700 font-medium">
                          Read more <FiArrowRight />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 bg-white/80 rounded-xl shadow-sm"
          >
            <h3 className="text-2xl font-medium text-amber-900 mb-3">
              No blogs found
            </h3>
            <p className="text-amber-700 mb-6 max-w-md mx-auto">
              Try adjusting your search to find what you're looking for.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-800 rounded-full font-medium hover:bg-amber-200 transition mx-auto"
            >
              Reset search <FiArrowRight />
            </button>
          </motion.div>
        )}
      </div>

      {/* Create Blog Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-amber-100">
              <h2 className="text-2xl font-semibold text-amber-900">
                Submit New Blog
              </h2>
            </div>

            {/* Modal Body - scrollable */}
            <div className="p-6 overflow-y-auto flex-grow">
              {submitSuccess ? (
                <div className="text-center py-8 text-green-600">
                  <p className="text-xl font-medium mb-2">
                    Blog Submitted Successfully!
                  </p>
                  <p>Your blog has been submitted for admin approval.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-amber-800 mb-2">Title</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={newBlog.title}
                        onChange={(e) =>
                          setNewBlog({ ...newBlog, title: e.target.value })
                        }
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-amber-800 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={newBlog.author}
                        onChange={(e) =>
                          setNewBlog({ ...newBlog, author: e.target.value })
                        }
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-amber-800 mb-2">
                        Content
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[200px]"
                        value={newBlog.content}
                        onChange={(e) =>
                          setNewBlog({ ...newBlog, content: e.target.value })
                        }
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-amber-800 mb-2">
                        Featured Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        id="blog-image-upload"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="blog-image-upload"
                        className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-lg cursor-pointer hover:bg-amber-200 transition mr-4"
                      >
                        Upload Image
                      </label>
                      {newBlog.previewImage && (
                        <div className="mt-4 w-full h-48 rounded-lg overflow-hidden">
                          <img
                            src={newBlog.previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer - always visible */}
            {!submitSuccess && (
              <div className="p-6 border-t border-amber-100 flex justify-end gap-4">
                <button
                  onClick={() => setOpenModal(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-amber-800 hover:bg-amber-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitBlog}
                  disabled={isSubmitting || !newBlog.title || !newBlog.content}
                  className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Approval"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
