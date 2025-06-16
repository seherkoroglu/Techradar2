import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { AnimatePresence, motion } from "framer-motion";


export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9); // 🔹 Başlangıçta 6 ürün gösterilecek

  const fetchProducts = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/products/products`;
    if (company) {
      url = `${import.meta.env.VITE_API_URL}/products/products/by-company?company=${encodeURIComponent(company)}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
      setVisibleCount(6); // 🔹 Arama yapıldığında görünür ürün sayısı sıfırlansın
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [company]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
      <>
          <Navbar/>
          <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
              {/* Blur arka plan görseli */}
              <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
                  style={{
                      backgroundImage: "url('/images/şirketürünlerihero.png')",
                      backgroundAttachment: "fixed",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                  }}
              ></div>

              {/* Yazı içeriği */}
              <div className="relative z-10 text-center max-w-4xl px-6">
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">Ürün Listesi</h1>
                  <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
                      Şirketlere ait ürünleri buradan görüntüleyebilir ve filtreleyebilirsin.
                  </p>
              </div>
          </section>
          <div className="max-w-6xl mx-auto p-6 space-y-8">
              <motion.div
                  whileHover={{scale: 1.02}}
                  transition={{type: "spring", stiffness: 200, damping: 15}}
              >
                  <div className="text-center">
                      <h2 className="text-4xl font-bold text-indigo-700">Ürün Listesi</h2>
                      <p className="text-2xl text-gray-600 mt-2">
                          Şirketlere ait ürünleri buradan görüntüleyebilir ve filtreleyebilirsin.
                      </p>
                  </div>
              </motion.div>
              <motion.div
                  whileHover={{scale: 1.02}}
                  transition={{type: "spring", stiffness: 200, damping: 15}}
              >
                  <div className="flex justify-center">
                      <input
                          type="text"
                          placeholder="🔍 Şirket adıyla ara (örn: Google)"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full md:w-1/2 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                      />
                  </div>
              </motion.div>
                  {loading ? (
                      <div className="text-center text-indigo-600 text-lg">Yükleniyor...</div>
                  ) : products.length === 0 ? (
                      <div className="text-center text-gray-500">Hiç ürün bulunamadı.</div>
                  ) : (
                      <>
                          <div className="w-full grid gap-6  md:grid-cols-3 3xl:grid-cols-3">
                              {products.slice(0, visibleCount).map((product, index) => (
                                  <motion.div
                                      whileHover={{scale: 1.02}}
                                      transition={{type: "spring", stiffness: 200, damping: 15}}
                                  >
                                      <div
                                          key={index}
className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 transition duration-300 min-h-[320px]"
                                      >
                                          <h3 className="text-2xl font-bold text-indigo-700 mb-1">
                                              {product.product_name}
                                          </h3>
                                          <p className="text-xl text-gray-500 mb-2">
                                              <strong>Şirket:</strong> {product.company}
                                          </p>
                                          <p className="text-x text-gray-500 mb-2">
                                              <strong>Yıl:</strong> {product.launch_year}
                                          </p>
                                          <p className="text-xl text-gray-500 mb-2">
                                              <strong>Alt Alan:</strong> {product.subfield}
                                          </p>
                                          <p className="text-xl text-gray-600 mt-2">{product.description}</p>
                                      </div>
                                  </motion.div>
                              ))}
                          </div>

                          {visibleCount < products.length && (
                              <motion.div
                                  whileHover={{scale: 1.02}}
                                  transition={{type: "spring", stiffness: 200, damping: 15}}
                              >
                                  <div className="text-center mt-6">
                                      <button
                                          onClick={handleShowMore}
                                          className="bg-indigo-600 text-white px-10 py-3 rounded hover:bg-indigo-700 transition text-2xl"
                                      >
                                          Devamını Gör
                                      </button>
                                  </div>
                              </motion.div>
                          )}
                      </>
                  )}
          </div>
      </>
);
}
