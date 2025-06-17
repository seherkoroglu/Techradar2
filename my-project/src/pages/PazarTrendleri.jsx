import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { AnimatePresence, motion } from "framer-motion";

export default function PazarTrendleri() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/ai/trend-prediction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.status === "success") {
        const phraseExplanations = (phrase) => {
          phrase = phrase.toLowerCase();
          if (phrase.includes("fintech")) return "Finansal teknolojilerle ilgili.";
          if (phrase.includes("startup")) return "Yeni kurulan teknoloji girişimlerini ifade eder.";
          if (phrase.includes("ai")) return "Yapay zeka uygulamalarıyla ilgili.";
          if (phrase.includes("security")) return "Siber güvenlik alanındaki gelişmelere işaret eder.";
          if (phrase.includes("data")) return "Veri analitiği ve büyük veri trendlerini yansıtır.";
          if (phrase.includes("crypto")) return "Kripto para ve blockchain temelli içerikler olabilir.";
          return "Bu ifade sektörde dikkat çeken bir gelişmeyi yansıtıyor olabilir.";
        };

        const results = data.trends.map((item) => {
          const label = item.subfield;
          const count = item.count;
          const status = item.status;

          const relatedPhrases = (data.phrases[label] || []).map(([phrase, freq]) => ({
            phrase,
            freq,
            explanation: phraseExplanations(phrase),
          }));

          return {
            label,
            count,
            status,
            reason:
              status === "safe"
                ? `${label} alanı bu hafta haberlerde sıkça yer aldı.`
                : `${label} alanı bu hafta daha az ilgi gördü.`,
            advice:
              status === "safe"
                ? "Bu alanda içerik üretimi veya yatırım için uygun zaman olabilir."
                : "Bu alanda dikkatli ilerlemek veya farklı trendlere yönelmek gerekebilir.",
            relatedPhrases: relatedPhrases.slice(0, 5),
          };
        });

        setCards(results);

        const commentTexts = results.map(
          (r) => `${r.label} (${r.count} haber): ${r.status === "safe" ? "güvenli" : "riskli"}`
        );

        const aiRes = await fetch(`${import.meta.env.VITE_API_URL}/ai/forecast-advice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comments: commentTexts }),
        });

        const aiData = await aiRes.json();
        if (aiData.status === "success") {
          setAdvice(aiData.advice);
        }
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div>

        <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
          {/* Blur arka plan görseli */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
              style={{
                backgroundImage: "url('/images/market-hero.png')",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          ></div>

          {/* Yazı içeriği */}
          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">Pazar Trend ve Risk Haritası</h1>
            <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
              Haftalık haber verileriyle hangi teknoloji alanı daha güvenli ya da riskli keşfedin.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
          <motion.div
              whileHover={{scale: 1.02}}
              transition={{type: "spring", stiffness: 200, damping: 15}}
          >
            <div className="text-center">
              <button
                  onClick={fetchTrends}
                  disabled={loading}
                  className="px-6 py-4 my-2 bg-indigo-600 text-white text-3xl rounded-full hover:bg-indigo-700 transition shadow-lg">
                {loading ? "Yapay zeka tavsiyesi yükleniyor..." : "Trendleri Göster"}
              </button>
            </div>
          </motion.div>
          <motion.div
              whileHover={{scale: 1.02}}
              transition={{type: "spring", stiffness: 200, damping: 15}}
          >
            {advice && (
                <div className=" p-5 rounded-xl shadow-md w-full">
                  <h3 className="font-bold text-5xl mb-2 text-center">Yapay Zeka Tavsiyesi</h3>
                  <p className="text-gray-700 text-2xl w-full">{advice}</p>
                </div>
            )}
            </motion.div>
            <motion.div
                whileHover={{scale: 1.02}}
                transition={{type: "spring", stiffness: 200, damping: 15}}
            >
              {cards.length > 0 && (
                  <div className="w-full flex-row">
                    <div className="grid gap-8 max-w-6xl w-full text-center">
                      {cards.map((item, index) => (
                          <div
                              key={index}
                              className={`p-6 rounded-xl shadow-lg border-l-4 w-full ${
                                  item.status === "safe"
                                      ? "bg-green-50 border-green-500"
                                      : "bg-red-50 border-red-500"
                              }`}
                          >
                            <h2
                                className={`text-3xl font-semibold mb-4 flex items-center gap-2 ${
                                    item.status === "safe" ? "text-green-700" : "text-red-700"
                                }`}
                            >
                              {item.status === "safe" ? "✅ Güvenli Alan" : "⚠️ Riskli Alan"} — {item.label}
                            </h2>
                            <p className="text-2xl text-gray-800 mb-1">📌 {item.reason}</p>
                            <p className="text-2xl text-gray-600 italic mb-2">💡 {item.advice}</p>
                            <p className="text-2xl text-gray-500 mb-2">📰 Haber Sayısı: {item.count}</p>

                            {item.relatedPhrases.length > 0 && (
                                <div>
                                  <p className="text-xl font-medium text-gray-500">🔍 Öne Çıkan İfadeler:</p>
                                  <ul className="list-disc list-inside text-xl text-gray-700 space-y-1">
                                    {item.relatedPhrases.map((phraseItem, i) => (
                                        <li key={i}>
                                          <strong>{phraseItem.phrase}</strong> ({phraseItem.freq}): {phraseItem.explanation}
                                        </li>
                                    ))}
                                  </ul>
                                </div>
                            )}
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </motion.div>

        </div>
      </div>
    </>
);
}
