import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../components/Navbar.jsx";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function YatirimRadar() {
  const [topCompanies, setTopCompanies] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/investments/investments/top`);
        const data = await res.json();
        setTopCompanies(data);

        const aiRes = await fetch(`${import.meta.env.VITE_API_URL}/investments/investments/ai-reasons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companies: data }),
        });

        const aiJson = await aiRes.json();
        if (aiJson.status === "success") {
          const commentMap = {};
          aiJson.comments.forEach((c) => {
            commentMap[c.company] = c.comment;
          });
          setComments(commentMap);
        }
      } catch (err) {
        console.error("Yükleme hatası:", err);
      }
    };

    fetchData();
  }, []);

  const formatAmount = (value) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const barData = {
    labels: topCompanies.map((item) => item.company),
    datasets: [
      {
        label: "Yatırım (USD)",
        data: topCompanies.map((item) => item.amount),
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  return (
      <>
        <Navbar/>

        {/* HERO SECTION */}

        <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
          {/* Blur arka plan görseli */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
              style={{
                backgroundImage: "url('/images/yatırımradarhero.png')",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          ></div>

          {/* Yazı içeriği */}
          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">Yatırım Radarı</h1>
            <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
              2020 - 2025 döneminde en çok yatırım alan şirketleri keşfedin
            </p>
          </div>
        </section>

        <div className="max-w-8xl mx-auto p-6 space-y-10">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
              En Çok Yatırım Alan Şirketler
            </h2>
            <Bar data={barData}/>
          </div>

          {/* YATIRIM KARTLARI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topCompanies.map((item, i) => (
                <div
                    key={i}
                    className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl hover:scale-[1.02] transition duration-300 border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-indigo-700 ">{item.company}</h3>
                  <div className="text-xl text-gray-600 space-y-1">
                    <p><span className="font-medium text-gray-800">Sektör:</span> {item.sector}</p>
                    <p><span className="font-medium text-gray-800">Ülke:</span> {item.country}</p>
                    <p><span className="font-medium text-gray-800">Yatırım:</span> {formatAmount(item.amount)}</p>
                  </div>
                  {comments[item.company] && (
                      <div className=" text-xl mt-4 p-3 rounded text-gray-800">
                        🧠 <strong>AI Yorumu:</strong> {comments[item.company]}
                      </div>
                  )}
                </div>
            ))}
          </div>
        </div>
      </>
  );
}
