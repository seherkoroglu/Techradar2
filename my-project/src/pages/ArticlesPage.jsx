import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AnimatePresence, motion } from "framer-motion";


export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Giriş yapılmamış.");
          setLoading(false);
          return;
        }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/articles/by-subfield`, {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(res.data)) {
          setArticles(res.data);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error(err);
        setError("Makaleler alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
      <>
        <Navbar/>

        {/* Hero Section */}


        <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
          {/* Blur arka plan görseli */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
              style={{
                backgroundImage: "url('/images/article-hero.png')",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          ></div>

          {/* Yazı içeriği */}
          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">İlgi Alanına Göre Makaleler</h1>
            <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
              Senin için en uygun içerikleri keşfet!
            </p>
          </div>
        </section>

        <div className=" px-6 py-10 min-h-screen">
          {loading && <div className="text-center text-xl text-gray-800">Yükleniyor...</div>}

          {error && <div className="text-center text-red-500">{error}</div>}

          {!loading && !error && (
              <>
                {articles.length === 0 ? (
                    <p className="text-center text-gray-700">Hiç makale bulunamadı.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {articles.map((article) => (
                          <motion.div
                              whileHover={{scale: 1.02}}
                              transition={{type: "spring", stiffness: 200, damping: 15}}
                          >
                              <div
                                  key={article._id}
                                  className="bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 group"
                              >
                                  <h3 className="text-xl font-bold text-purple-800 group-hover:text-purple-600">
                                      {article.title}
                                  </h3>
                                  <p className="text-xl text-gray-500 mb-2">{article.date}</p>

                                  <div
                                      className="text-gray-700 text-xl mb-4 max-h-32 overflow-hidden"
                                      dangerouslySetInnerHTML={{__html: article.summary}}
                                  />

                                  <a
                                      href={article.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 text-2xl hover:text-indigo-800 transition"
                                  >
                                      Makaleyi Gör
                                  </a>
                              </div>
                              </motion.div>
                              ))}

                          </div>

                      )}
                    </>
                )}
              </div>
              </>
              );
          }
