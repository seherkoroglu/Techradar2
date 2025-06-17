import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";


export default function CompetitorPage() {
  const [sector, setSector] = useState("Artificial Intelligence");
  const [competitors, setCompetitors] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const sectors = [
    "Artificial Intelligence",
    "Blockchain",
    "Cyber Security",
    "HealthTech",
    "FinTech",
    "E-Commerce",
    "Software",
    "EdTech",
    "IoT",
    "Data Science",
    "Other"
  ];

  useEffect(() => {
    async function fetchCompetitors() {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/competitors?sector=${encodeURIComponent(sector)}`);
        const data = await res.json();
        if (data.status === "success") {
          setCompetitors(data.competitors);
          setVisibleCount(5);
        }
      } catch (error) {
        console.error("Rakipler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitors();
  }, [sector]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const shortenText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  async function handleAnalyzeSector() {
    try {
      setLoadingAnalysis(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/sector-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector, companies: competitors }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Analiz alınamadı:", error);
    } finally {
      setLoadingAnalysis(false);
    }
  }

  const renderAnalysis = () => {
    const sections = analysis.split("####").map((part) => part.trim()).filter(Boolean);

    return (
      <div className="flex flex-col gap-6 mt-8">
        {sections.map((section, idx) => {
          const lines = section.split("\n").filter(Boolean);
          const title = lines[0];
          const content = lines.slice(1).join(" ");

          return (
            <div
              key={idx}
              className="bg-indigo-700 rounded-2xl shadow p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">{title}</h3>
              <p
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/rekabet/gi, '<span class="text-rose-500 font-semibold">rekabet</span>')
                    .replace(/boşluk/gi, '<span class="text-green-600 font-semibold">boşluk</span>')
                    .replace(/fırsat/gi, '<span class="text-blue-600 font-semibold">fırsat</span>')
                    .replace(/ihtiyaç/gi, '<span class="text-purple-600 font-semibold">ihtiyaç</span>')
                    .replace(/girişim/gi, '<span class="text-orange-500 font-semibold">girişim</span>')
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
      <>
       <Navbar/>
        <div className="  mx-auto">

          <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
            {/* Blur arka plan görseli */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
                style={{
                  backgroundImage: "url('/images/competitor-hero.png')",
                  backgroundAttachment: "fixed",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
            ></div>

            {/* Yazı içeriği */}
            <div className="relative z-10 text-center max-w-4xl px-6">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">Rakip Analizi</h1>
              <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
                Sektörünüzdeki güçlü oyuncuları tanıyın, rekabette fark yaratacak içgörülerle stratejinizi güçlendirin.
              </p>
            </div>
          </section>


          <div className="my-16 flex justify-center">
            <div className="relative w-full max-w-md">
              <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-200 transition-all duration-300 ease-in-out text-lg px-5 py-4 rounded-xl shadow-md appearance-none hover:border-blue-400 cursor-pointer"
              >
                {sectors.map((s) => (
                    <option
                        key={s}
                        value={s}
                        className="text-base hover:bg-blue-100 hover:font-medium transition-all"
                    >
                      {s}
                    </option>
                ))}
              </select>

              {/* Aşağı ok simgesi */}
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>


          {loading ? (
              <div className="text-center">Yükleniyor...</div>
          ) : (
              <>
                <div className="flex flex-col gap-16 relative z-10 w-full">
                  {competitors.slice(0, visibleCount).map((company, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <motion.div
                            key={index}
                            initial={{opacity: 0, y: 40}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.5, delay: index * 0.1}}
                            className={`relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full ${
                                isLeft ? "md:flex-row" : "md:flex-row-reverse"
                            }`}

                        >


                          {/* Metin kutusu */}
                          <div
                              className="bg-blue-900 text-white px-8 py-6 rounded-xl shadow-md w-full md:w-5/6 hover:scale-105 transition-transform duration-300">
                            <h2 className="text-2xl font-bold mb-2">{company.name}</h2>
                            <p className="text-xl text-indigo-200">{company.employees}</p>
                            <p className="text-xl mt-2">{shortenText(company.description)}</p>
                            {company.name && (
                                <a
                                    href={`https://wellfound.com/company/${company.name.toLowerCase().replace(/\s+/g, "-")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-3 text-blue-300 hover:text-blue-400 text-3xl"
                                >
                                  Şirketi İncele 🔗
                                </a>
                            )}
                          </div>

                          {/* Görsel kutu (isteğe bağlı mockup) */}

                        </motion.div>
                    );
                  })}
                </div>
                {competitors.length > visibleCount && (
                    <div className="text-center mt-6">
                      <motion.div
                          whileHover={{scale: 1.05}}
                          transition={{type: "spring", stiffness: 200, damping: 15}}
                      >
                        <button
                            onClick={handleShowMore}
                            className="px-20 py-6 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                          Daha Fazla Göster
                        </button>
                      </motion.div>
                    </div>
                )}
              </>
          )}

          <div className="text-center">
            <motion.div
                whileHover={{scale: 1.05}}
                transition={{type: "spring", stiffness: 200, damping: 15}}
            >
              <button
                  onClick={handleAnalyzeSector}
                  className="px-20 py-6 my-10 bg-blue-800 text-white rounded hover:bg-indigo-700 transition"
                  disabled={loadingAnalysis}
              >
                {loadingAnalysis ? "Analiz Yapılıyor..." : "Sektör Analizi Yap"}
              </button>
            </motion.div>
          </div>

          {analysis && (
              <div className="bg-gradient-to-br from-white to-purple-500 mt-8 p-6 bg-gray-100 rounded shadow space-y-6">
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
                  {`Sektörel Rekabet Analizi: ${sector}`}
                </h2>
                <ul className="list-disc list-inside space-y-4 text-gray-800 text-lg">
                  {analysis.split("\n").map((item, index) => (
                      <li key={index}>{item.trim()}</li>
                  ))}
                </ul>
              </div>
          )}

        </div>
      </>
  );
}
