import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import Navbar from "../components/Navbar.jsx";
import { AnimatePresence, motion } from "framer-motion";


Chart.register(...registerables);

export default function Forecast() {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState("");
  const [generatingAdvice, setGeneratingAdvice] = useState(false);
  const [trendComments, setTrendComments] = useState([]);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forecast`);
        const data = await res.json();
        if (data.status === "success") {
          setForecastData(data.forecast);
        }
      } catch (error) {
        console.error("Tahmin verisi alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, []);

  useEffect(() => {
    if (!forecastData) return;

    const trends = Object.keys(forecastData);
    const comments = [];

    trends.forEach((field) => {
      const trendData = forecastData[field];
      if (!trendData || trendData.length < 2) return;

      const first = trendData[0].yhat;
      const last = trendData[trendData.length - 1].yhat;
      const changePercent = ((last - first) / first) * 100;

      if (changePercent > 2) comments.push(`${field} trendi artışta.`);
      else if (changePercent < -2) comments.push(`${field} trendi düşüşte.`);
      else comments.push(`${field} trendi sabit seyrediyor.`);
    });

    setTrendComments(comments);
  }, [forecastData]);

  async function fetchAiAdvice() {
    try {
      setGeneratingAdvice(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/forecast-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: trendComments }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setAiAdvice(data.advice);
      }
    } catch (error) {
      console.error("AI önerisi alınamadı:", error);
    } finally {
      setGeneratingAdvice(false);
    }
  }

  if (loading) return <div className="text-center mt-10">Yükleniyor...</div>;

  if (!forecastData || !forecastData["Artificial Intelligence"]) {
    return <div className="text-center mt-10">Veri bulunamadı.</div>;
  }

  const dates = forecastData["Artificial Intelligence"].map((item) => item.ds);

  const chartData = {
    labels: dates,
    datasets: Object.keys(forecastData).map((field, index) => ({
      label: field,
      data: forecastData[field].map((item) => item.yhat),
      fill: false,
      borderColor: [
        "#6366F1", "#10B981", "#FBBF24", "#EF4444", "#22C55E",
        "#3B82F6", "#A78BFA", "#FDE047", "#EC4899"
      ][index % 9],
      tension: 0.4,
    })),
  };

  return (
      <>
        <Navbar/>

        {/* Hero Section */}

        <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
          {/* Blur arka plan görseli */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
              style={{
                backgroundImage: "url('/images/forecast-hero.png')",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          ></div>

          {/* Yazı içeriği */}
          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">Trend Tahminleri</h1>
            <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
             Geleceğin teknoloji trendlerini keşfedin ve stratejinizi öngörülerle
              şekillendirin.
            </p>
          </div>
        </section>
        {/* İçerik */}
        <div className=" mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-6xl font-semibold text-center mb-6 text-indigo-700">Tüm Trend Alanları için 1 Aylık
              Tahmin</h2>
            <Line data={chartData}/>
          </div>

          <div className="text-center mt-12">
            <p className="text-5xl text-gray-700 mb-2">Sana özel öneri almak ister misin?</p>
            <motion.div
                whileHover={{scale: 1.02}}
                transition={{type: "spring", stiffness: 200, damping: 15}}
            >
              <button
                  onClick={fetchAiAdvice}
                  className="px-6 py-4 my-2 bg-indigo-600 text-white text-3xl rounded-full hover:bg-indigo-700 transition shadow-lg"
                  disabled={generatingAdvice}
              >
                {generatingAdvice ? "Öneri Üretiliyor..." : "AI Destekli Öneri Al"}
              </button>
            </motion.div>
          </div>

          <motion.div
              whileHover={{scale: 1.02}}
              transition={{type: "spring", stiffness: 200, damping: 15}}
          >
            {aiAdvice && (
                <div
                    className="mt-12 mx-auto max-w-5xl bg-white p-6 rounded-xl shadow-lg border border-indigo-200 text-center">
                  <h3 className="text-5xl font-bold mb-4  gap-3 text-center">
                    Yapay Zeka Strateji Önerisi
                  </h3>
                  <p className="text-2xl text-gray-800 leading-relaxed ">{aiAdvice}</p>
                </div>
            )}
                          </motion.div>

        </div>
      </>

);
}
