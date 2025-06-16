import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { AnimatePresence, motion } from "framer-motion";


export default function TahminSayfasi() {
  const [forecasts, setForecasts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/sirket_hisse_tahmin/stock-forecast/all`);
        const json = await res.json();

        const grouped = {};
        json.forEach(item => {
          const key = item.ticker;
          if (!grouped[key] || new Date(item.date) > new Date(grouped[key].date)) {
            grouped[key] = item;
          }
        });

        const latest = Object.values(grouped);
        setForecasts(latest);

        const aiRes = await fetch(`${import.meta.env.VITE_API_URL}/hissekart/ai/forecast-comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            forecasts: latest.map(item => ({
              ticker: item.ticker,
              predicted_price: item.predicted_price,
              lower_bound: item.lower_bound,
              upper_bound: item.upper_bound,
              count: 10,
              status: "safe"
            }))
          })
        });

        const aiData = await aiRes.json();
        if (aiData.status === "success") {
          const commentMap = {};
          aiData.comments.forEach(c => {
            commentMap[c.ticker] = c.comment;
          });
          setComments(commentMap);
        }
      } catch (err) {
        console.error("Hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg text-indigo-600">Yükleniyor...</p>;

  return (
      <>
          <Navbar/>

          {/* Hero Section */}

          <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
              {/* Blur arka plan görseli */}
              <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
                  style={{
                      backgroundImage: "url('/images/hisse-hero.png')",
                      backgroundAttachment: "fixed",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                  }}
              ></div>

              {/* Yazı içeriği */}
              <div className="relative z-10 text-center max-w-4xl px-6">
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">Hisse Tahminleri</h1>
                  <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
                      Model bazlı fiyat tahminleri ve AI destekli yorumlarla yatırımlarınızı şekillendirin.
                  </p>
              </div>
          </section>

          {/* Forecast Cards */}
          <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-white to-purple-100 min-h-screen">
              {forecasts.map((item, i) => (
                  <motion.div
                      whileHover={{scale: 1.02}}
                      transition={{type: "spring", stiffness: 200, damping: 15}}
                  >
                      <div
                          key={i}
                          className="bg-white rounded-xl shadow hover:shadow-lg p-5 transition-all duration-300 border border-gray-200"
                      >

                          <h2 className="text-2xl font-bold text-indigo-700 mb-2">{item.ticker}</h2>
                          <p className="text-xl text-gray-600 mb-1">
                              <strong>📅 Tarih:</strong> {new Date(item.date + "T00:00:00").toLocaleDateString("tr-TR")}
                          </p>
                          <p className="text-xl text-gray-800 mb-1">
                              <strong>🎯 Tahmin:</strong> ${item.predicted_price.toFixed(2)}
                          </p>
                          <p className="text-xl text-gray-800 mb-1">
                              <strong>📊 Güven Aralığı:</strong> ${item.lower_bound} - ${item.upper_bound}
                          </p>
                          <p className="text-xl text-gray-500 italic mt-1">Model: Holt</p>

                          {comments[item.ticker] && (
                              <div
                                  className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4 text-2xl rounded text-gray-800">
                                  🧠 {comments[item.ticker]}
                              </div>

                          )}
                      </div>
                      </motion.div>
                      ))}
                  </div>
                  </>
                  );
              }
