import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import TrendCard from "../components/TrendCard";
import AIStrategyCard from "../components/AIStrategyCard";



export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Büyüme Stratejileri");
  const [categorySuggestions, setCategorySuggestions] = useState({
    "Büyüme Stratejileri": [],
    "İnovasyon Önerileri": [],
    "Teknoloji Yatırımları": [],
  });
  const [news, setNews] = useState([]);

  const categoryIcons = {
    "Büyüme Stratejileri": "🚀",
    "İnovasyon Önerileri": "💡",
    "Teknoloji Yatırımları": "🤖",
  };
  const categoryMap = {
  "Büyüme Stratejileri": "growth",
  "İnovasyon Önerileri": "innovation",
  "Teknoloji Yatırımları": "tech",
};

  const imagesMap = {
  "Büyüme Stratejileri": [
    "/images/strategies/growth1.png",
    "/images/strategies/growth2.png",
    "/images/strategies/growth3.png",
    "/images/strategies/growth4.png",
    "/images/strategies/growth5.png",
    "/images/strategies/growth6.png",
      "/images/strategies/growth7.png",
      "/images/strategies/growth8.png",
  ],
  "İnovasyon Önerileri": [
    "/images/strategies/innovation1.png",
    "/images/strategies/innovation2.png",
    "/images/strategies/innovation3.png",
          "/images/strategies/innovation4.png",
    "/images/strategies/innovation5.png",

  ],
  "Teknoloji Yatırımları": [
    "/images/strategies/tech1.png",
    "/images/strategies/tech2.png",
      "/images/strategies/tech3.png",
      "/images/strategies/tech4.png",

  ],
};

useEffect(() => {
  const loadSuggestions = async () => {
    if (!user) return;
    const backendCategory = categoryMap[activeTab];
    const suggestions = await fetchCategorySuggestions(backendCategory);

    setCategorySuggestions(prev => ({
      ...prev,
      [activeTab]: suggestions,
    }));
  };

  loadSuggestions();
}, [activeTab, user]);


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Kullanıcı alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchCategorySuggestions = async (category) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: user.company,
          sector: user.sector,
          subfields: user.subfields,
          category: category,
        }),
      });
      const data = await res.json();
      return data.suggestions
  .split("\n")
  .filter(line => line.trim())
  .slice(0, 5); // İlk 5 öneriyi al

    } catch (error) {
      console.error(`${category} önerileri alınamadı:`, error);
      return [];
    }
  };

  const fetchAllSuggestions = async () => {
    if (!user) return;

    const [growth, innovation, tech] = await Promise.all([
      fetchCategorySuggestions("growth"),
      fetchCategorySuggestions("innovation"),
      fetchCategorySuggestions("tech"),
    ]);

    setCategorySuggestions({
      "Büyüme Stratejileri": growth,
      "İnovasyon Önerileri": innovation,
      "Teknoloji Yatırımları": tech,
    });
  };

  const fetchNews = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/ai/ai/trend-news"); // 📰 haberler backend'den geliyor
      const data = await res.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("Haberler alınamadı:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllSuggestions();
      fetchNews();
      const interval = setInterval(fetchNews, 60000); // her 60 saniyede bir haber güncelle
      return () => clearInterval(interval);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700">
        <p className="text-white text-lg animate-pulse">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700">
        <p className="text-red-400 text-lg">Kullanıcı bilgisi yüklenemedi.</p>
      </div>
    );
  }

  return (
      <>
        <Navbar/>

        {/* Hero Alanı */}

        <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
          {/* Blur arka plan görseli */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
              style={{
                backgroundImage: "url('/images/anasayfa.png')",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          ></div>

          {/* Yazı içeriği */}
          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">AI Destekli Strateji Önerileri</h1>
            <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
              Şirketinize özel büyüme, inovasyon ve teknoloji yatırımı fikirleri
            </p>
          </div>
        </section>
        <div className="w-full mx-auto px-20 py-10 text-center">
          {/* Kullanıcı Kutusu */}
          <motion.div
              whileHover={{scale: 1.03}}
              transition={{type: "spring", stiffness: 100, damping: 22}}
          >

            <h2 className="text-4xl font-semibold mb-10  text-center">Hoş geldiniz, {user.email}</h2>
            <p className="font-medium text-center text-2xl" ><span >Şirket:</span > {user.company}</p>
            <p className="font-medium text-center text-2xl" ><span>Sektör:</span> {user.sector}</p>
            <p className="font-medium text-center text-2xl"><span>Website:</span> {user.website || "Belirtilmemiş"}</p>
          </motion.div>

          {/* Sekme Butonları */}

          <div className="flex flex-wrap gap-20 justify-center my-14">
            {Object.keys(categorySuggestions).map((tab) => (
                <motion.div
                    whileHover={{scale: 1.05}}
                    transition={{type: "spring", stiffness: 200, damping: 15}}
                >
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-20 py-3 rounded-lg text-md font-semibold transition-all border ${
                          activeTab === tab
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}

                  >
                    {tab}
                  </button>
                </motion.div>
            ))}

          </div>

          {/* Kartlar */}
          <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                transition={{duration: 0.4}}
                className="flex flex-col gap-16"
            >
              {categorySuggestions[activeTab].map((item, index) => {
                const image =
                    imagesMap[activeTab]?.[index] || "/images/strategies/default.png";

                return (
                    <AIStrategyCard
                        key={index}
                        text={item}
                        index={index}
                        image={image}
                    />
                );
              })}


            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <motion.div
              whileHover={{scale: 1.05}}
              transition={{type: "spring", stiffness: 200, damping: 15}}
          >
            <div className="mt-20 text-center">
              <button
                  onClick={fetchAllSuggestions}
                  className="bg-blue-600 text-white font-semibold px-20 py-8 rounded-md hover:bg-blue-700 transition-all shadow-md"
              >
                Yeni Öneriler Al
              </button>
            </div>
          </motion.div>


            {/* Haberler */}
            <div className="w-full mt-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-12 text-center">Trend Haberler</h2>

              <div className="relative">
             {news.map((item, index) => (
                 <motion.div
                     whileHover={{scale: 1.05}}
                     transition={{type: "spring", stiffness: 200, damping: 15}}
                 >


                   <TrendCard key={index} item={item} index={index}/>
                 </motion.div>
                   ))}
              </div>
            </div>




        </div>
      </>
);
}

