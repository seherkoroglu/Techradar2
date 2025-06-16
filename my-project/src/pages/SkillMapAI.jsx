import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar.jsx";
import { SparklesIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from "framer-motion";


function SkillMapAI() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ai/skill-map-analysis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(res.data.result);
    } catch (err) {
      setResult("❌ Analiz alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return (
      <>
        <Navbar/>
        <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
          {/* Blur arka plan görseli */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur"
              style={{
                backgroundImage: "url('/images/skilllmaphero.png')",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          ></div>

          {/* Yazı içeriği */}
          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">Yetenek Haritası</h1>
            <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
              Şirketinizin güçlü yönleri, gelişime açık alanları ve işbirliği fırsatları yapay zeka destekli analizle
              aşağıda sunulmuştur.
            </p>
          </div>
        </section>

        <div className="justify-center  min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-6 text-center">
                {/* Başlık */}
                <motion.div
                    whileHover={{scale: 1.02}}
                    transition={{type: "spring", stiffness: 200, damping: 15}}
                >
                    {/* Analizi Yenile Butonu */}
                    <button
                        onClick={fetchAnalysis}
                        className="text-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-2xl font-medium px-10 py-2 rounded shadow transition"
                    >
                        Analizi Yenile
                    </button>
                </motion.div>
                    {/* Sonuç Kutusu */}
                    <motion.div
                        whileHover={{scale: 1.02}}
                        transition={{type: "spring", stiffness: 200, damping: 15}}
                    >
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-5">
                            {loading ? (
                                <p className="text-bold text-center text-gray-500 animate-pulse">Yükleniyor...</p>
                            ) : (
                                <div className="text-bold whitespace-pre-wrap text-gray-800 leading-relaxed space-y-2">
                                    {result.split("\n").map((line, idx) => (
                                        <p
                                            key={idx}
                                            className={
                                                line.match(/^\d+\./) ? "font-semibold text-bold text-2xl mt-4 text-indigo-800" : ""
                                            }
                                        >
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
            </div>
        </div>
      </>
);
}

export default SkillMapAI;
