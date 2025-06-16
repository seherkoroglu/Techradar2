import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";

export default function TechMigrations() {
  const [migrations, setMigrations] = useState([]);
  const [loading, setLoading] = useState(true);
const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/tech-migrations`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setMigrations(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Veri alınamadı", err);
        setLoading(false);
      });
  }, []);

  const handleShowMore = () => {
  setVisibleCount((prev) => prev + 10);
};

  return (
      <>
          <Navbar/>
          <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
              {/* Blur arka plan görseli */}
              <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
                  style={{
                      backgroundImage: "url('/images/teknolojigecisleri.png')",
                      backgroundAttachment: "fixed",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                  }}
              ></div>

              {/* Yazı içeriği */}
              <div className="relative z-10 text-center max-w-4xl px-6">
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">Teknoloji Geçişleri</h1>
                  <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
                      Büyük teknoloji şirketlerinin zaman içinde yaptığı yazılım geçişleri
                  </p>
              </div>
          </section>
          <div className="max-w-8xl mx-auto p-6 space-y-6">




              {loading ? (
                  <p className="text-center text-gray-500 mt-10 animate-pulse">Yükleniyor...</p>
              ) : (
                  <div className=" w-full shadow-xl rounded-lg border border-gray-200">
                      <table className="w-full text-sm text-gray-800 bg-white rounded-md overflow-hidden">
                          <thead className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white text-left">
                          <tr>
                              <th className="px-5 py-3">Şirket</th>
                              <th className="px-5 py-3">Kaynak Teknoloji</th>
                              <th className="px-5 py-3">Hedef Teknoloji</th>
                              <th className="px-5 py-3">Yıl</th>
                          </tr>
                          </thead>
                          <tbody>
                          {migrations.slice(0, visibleCount).map((row, idx) => (
                              <tr
                                  key={idx}
                                  className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50 transition duration-200"
                              >
                                  <td className="px-5 py-3 font-medium">{row.company}</td>
                                  <td className="px-5 py-3">{row.source_tech || "-"}</td>
                                  <td className="px-5 py-3 text-purple-700 font-semibold">{row.destination_tech}</td>
                                  <td className="px-5 py-3 text-gray-500">{row.year}</td>
                              </tr>
                          ))}
                          </tbody>

                      </table>


                  </div>

              )}
              {visibleCount < migrations.length && (
                  <div className="text-center mt-6">
                      <button
                          onClick={handleShowMore}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                      >
                          Devamını Gör
                      </button>
                  </div>
              )}
          </div>

      </>
  );
}
