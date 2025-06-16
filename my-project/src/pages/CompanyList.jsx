import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";


export default function EventbriteEvents() {
  const [keyword, setKeyword] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const handleFetchEvents = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/eventbrite/events-search`,
        { keyword },
        { headers: { "Content-Type": "application/json" } }
      );
      setEvents(response.data.events || []);
      setError(null);
    } catch (err) {
      console.error("Hata:", err);
      setError(err.response?.data?.detail || err.message || "Bir hata oluştu.");
    }
  };

  return (
      <>
          <Navbar/>
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
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">
                      Etkinlikleri Keşfet
                  </h1>
                  <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
                      İlgi alanınıza göre en güncel etkinlikleri bulun, fırsatları kaçırmayın!
                  </p>

              </div>
          </section>
          <section className="min-h-screen px-6 py-12">
              <div className="max-w-8xl mx-auto text-center space-y-6">
                  <h2 className="text-4xl font-bold text-indigo-700"> Etkinlik Ara</h2>
                  <motion.div
                      whileHover={{scale: 1.02}}
                      transition={{type: "spring", stiffness: 200, damping: 15}}
                  >
                      <form onSubmit={handleFetchEvents}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                          <input
                              type="text"
                              placeholder="Konu girin (örn: AI, Blockchain)"
                              value={keyword}
                              onChange={(e) => setKeyword(e.target.value)}
                              className="w-full sm:w-80 px-4 py-2 rounded-md border shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />

                          <motion.div
                              whileHover={{scale: 1.02}}
                              transition={{type: "spring", stiffness: 200, damping: 15}}
                          >
                              <button
                                  type="submit"
                                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
                              >
                                  Eventleri Getir
                              </button>
                          </motion.div>
                      </form>
                  </motion.div>
                      {error && <p className="text-red-500">{error}</p>}

                      <div className="mt-10 grid gap-6">
                          {events.length === 0 ? (
                              <p className="text-gray-600">Henüz etkinlik bulunamadı.</p>
                          ) : (
                              events.map((event, index) => (
                                  <motion.div
                                      whileHover={{scale: 1.02}}
                                      transition={{type: "spring", stiffness: 200, damping: 15}}
                                  >
                                      <div
                                          key={index}
                                          className="bg-white border rounded-lg shadow hover:shadow-indigo-300 transition-all p-6 text-left"
                                      >
                                          <h3 className="text-xl font-semibold text-indigo-700">{event.title}</h3>
                                          <p className="mt-1 text-sm text-gray-700">
                                              <strong>Tarih:</strong> {event.date?.when || "Tarih bilgisi yok"}
                                          </p>
                                          <p className="mt-1 text-sm text-gray-700">
                                              <strong>Açıklama:</strong> {event.description?.slice(0, 100) || "Açıklama yok"}...
                                          </p>
                                          <a
                                              href={event.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="mt-2 inline-block text-indigo-600 font-medium hover:underline text-sm"
                                          >
                                              Etkinlik Linki
                                          </a>
                                      </div>
                                  </motion.div>
                              ))
                          )}
                      </div>

              </div>
          </section>
      </>
  );
}
