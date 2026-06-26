import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaYoutube, FaExternalLinkAlt, FaPlay } from "react-icons/fa";
import AnimatedUnderline from "../AnimatedUnderline/AnimatedUnderline";
import { fetchCachedJson } from "../../lib/api";
import { getOptimizedImage, getVideoAsset } from "../../lib/media";

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoCards = [
    {
      id: 1,
      title: "शिवकालीन शस्त्रांचे आजचे शिल्पकार | Satyajit Arun Vaidya",
      description:
        "रुद्र आर्ट्स आणि हँडीक्राफ्ट्स चे संस्थापक सत्यजीत अरुण वैद्य यांच्यासोबत हा संवाद आहे, ज्यांनी ऐतिहासिक शस्त्रांची आवड व्यवसायात रूपांतरित केली. त्यांनी त्यांच्या नोकरीला सोडून, इतिहासाच्या प्रेमाने प्रेरित होऊन शस्त्रांची पुनर्रचना कशी केली आणि त्यात आलेल्या अडचणींचा समावेश केला आहे.",
      thumbnail: getVideoAsset("featured1").poster,
      link: getVideoAsset("featured1").youtubeUrl,
    },
    {
      id: 2,
      title:
        "भेटरूपी ऐतिहासिक शस्त्र बनवतात पुण्यातील सत्यजीत वैद्य | historic weapons",
      description:
        "शस्त्रांनी घडवलेला इतिहास आजच्या पिढीला समजावा याची जाणीव सत्यजीत यांना एक घटनेतून झाली आणि मग त्यांनी थेट शस्त्रच बनवायला सुरुवात केली",
      thumbnail: getVideoAsset("featured2").poster,
      link: getVideoAsset("featured2").youtubeUrl,
    },
    {
      id: 3,
      title: "पुरातन शस्त्रांचा इतिहास जोपासणारा 'कलाकार मावळा'",
      description:
        "छत्रपती शिवाजी महाराज, छत्रपती संभाजी महाराज यांच्या बरोबर अनेक मावळे शस्रास्रे घेऊन युद्धासाठी जात आणि या लढाया जिकूनच त्यानी  स्वराज्याची स्थापना केली. त्यावेळी जी शस्त्रे वापरत होती ती इतिहासकालीन शस्त्रे आज कुठे तरी लोप पावत चालली आहेत. पण आपलें शस्त्रावरील प्रेम आपलं कलेवरील प्रेम आणि आपला इतिहास जिवंत ठेवण्यासाठी एक तरुण पूर्ण शस्त्रांचे दालन बनवतो ते पण असे दालन जिथे गेल्यावर महाराजांची आठवण आल्याशिवाय राहणार नाही.   ",
      thumbnail: getVideoAsset("featured3").poster,
      link: getVideoAsset("featured3").youtubeUrl,
    },
  ];

  const fetchLatestNews = async () => {
    try {
      const data = await fetchCachedJson("/api/news?limit=4&sort=desc", {
        cacheKey: "news:homepage",
        ttlMs: 3 * 60 * 1000,
      });
      const filteredNews = (data.newsItems || []).filter(
        (news) => !news.isHide,
      );
      setNewsData(filteredNews.reverse());
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-gradient-to-b from-amber-50 to-amber-100 text-black font-times">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl text-customBrown font-normal mb-3"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <img
                src="/images/dhaltalwar.png"
                alt="Left Icon"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <AnimatedUnderline>
                Rudra Arts & Handicrafts LLP News
              </AnimatedUnderline>
              <img
                src="/images/dhaltalwar.png"
                alt="Right Icon"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
          >
            Discover the rich heritage behind handcrafted art
          </motion.p>
        </div>

        {/* News Section */}
        <div className="mb-16">
          <h2 className="text-xl sm:text-2xl font-medium text-customBrown mb-6 sm:mb-8 text-center">
            Latest Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {newsData.map((news, index) => (
              <motion.div
                key={news._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Top Image */}
                <div className="relative">
                  <img
                    src={getOptimizedImage(news.image, "blog")}
                    alt={news.title}
                    className="w-full h-40 sm:h-52 object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-news.jpg";
                    }}
                    loading="lazy"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-amber-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full shadow">
                    Latest
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col justify-between h-[220px] sm:h-[260px]">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-customBrown mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                      {news.shortDescription ||
                        (news.description &&
                          news.description.substring(0, 100) + "...") ||
                        "No description available"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 sm:mt-4 flex items-center justify-between">
                    <a
                      href={news.slug || news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-amber-700 text-xs sm:text-sm font-medium hover:text-amber-900 transition"
                    >
                      <span>Read More</span>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>

                    {(news.slug || news.link) && (
                      <a
                        href={news.slug || news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-700 hover:text-amber-900 transition text-sm sm:text-lg"
                        title="View External Link"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-customBrown mb-6 sm:mb-8 text-center">
            Featured Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {videoCards.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Video Container */}
                <div className="relative aspect-video bg-black group">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 hover:bg-black/35"
                    aria-label={`Watch ${video.title}`}
                  >
                    <div className="rounded-full bg-white/90 p-4 shadow-lg">
                      <FaPlay className="text-amber-700 text-xl" />
                    </div>
                  </a>
                </div>

                {/* Video Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-customBrown mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-xs sm:text-sm transition-colors duration-300"
                  >
                    <FaYoutube className="text-lg" />
                    <span>Watch More</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
