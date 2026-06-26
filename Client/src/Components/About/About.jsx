import { motion } from "framer-motion";
import AnimatedUnderline from "../AnimatedUnderline/AnimatedUnderline";

const cardVariants = {
  hidden: { opacity: 0, y: 20 }, // Reduced y value for smoother mobile animation
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15, // Faster stagger on mobile
      duration: 0.4, // Quicker animation
      ease: "easeOut", // Smoother easing
    },
  }),
};

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center py-12 sm:py-16 px-4 sm:px-6 md:py-24 text-center bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }} // Reduced y movement
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} // Faster animation
        viewport={{ once: true, margin: "-100px" }} // Adjusted margin for mobile
        className="max-w-4xl mx-auto px-2 sm:px-4"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal font-times text-customBrown mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <img
              src="/images/dhaltalwar.png"
              alt="Left Icon"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            />
            <AnimatedUnderline>
              The Story Behind Rudra Arts & Handicrafts LLP
            </AnimatedUnderline>
            <img
              src="/images/dhaltalwar.png"
              alt="Right Icon"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            />
          </div>
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-times text-black mt-1 sm:mt-2">
          A Journey Through Time: Building Innovation, Preserving Tradition
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto px-2 sm:px-4">
        {["The Beginning", "The Evolution", "Legacy of Art", "Our Mission"].map(
          (title, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }} // Adjusted for mobile
              className="bg-amber-50 border-l-2 sm:border-l-4 md:border-l-8 border-customBrown shadow-md sm:shadow-lg p-3 sm:p-4 md:p-6 h-auto text-left font-times rounded-l-lg sm:rounded-l-xl opacity-90"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#3e3228] mb-1 sm:mb-2">
                {title}
              </h3>
              <p className="text-[#5e4d3f] text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed sm:leading-loose">
                {title === "The Beginning"
                  ? "Rooted in deep cultural passion, Rudra Arts & Handicrafts began its journey to revive the legacy of traditional weaponry—fusing timeless craftsmanship with a modern outlook."
                  : title === "The Evolution"
                    ? "With time, our vision expanded. We now craft cultural artifacts and regal creations that reflect both artistic integrity and historical authenticity."
                    : title === "Legacy of Art"
                      ? "Each piece reflects the soul of Indian heritage—carefully curated with precision, pride, and the timeless skills passed through generations."
                      : "We aim to preserve and promote this cultural heritage globally, offering handcrafted excellence while embracing evolving aesthetics."}
              </p>
            </motion.div>
          ),
        )}
      </div>
    </div>
  );
};

export default AboutUs;
