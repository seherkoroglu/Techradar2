import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function IsbirligiFirsatlari() {
  const [opportunities, setOpportunities] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collaboration/suggestions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setOpportunities(data);
      } catch (err) {
        console.error("Veri alınamadı", err);
      }
    };

    fetchOpportunities();
  }, []);

  const handleSendRequest = async (receiverEmail) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collaboration/send-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ receiver_email: receiverEmail }),
      });

      const data = await res.json();
      setMessage(data.message || "İstek gönderildi!");
    } catch (err) {
      console.error("İstek gönderilemedi", err);
      setMessage("Bir hata oluştu.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[3px]"
          style={{
            backgroundImage: "url('/images/collabhero.png')",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
                  backgroundPosition: "center",
          }}
        ></div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold drop-shadow-xl"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            İş Birliği Fırsatları
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl opacity-95 drop-shadow"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Yapay zeka destekli eşleşmelerle şirketinize en uygun partnerleri keşfedin.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {message && (
          <motion.div
            className="mb-6 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded shadow-md flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>{message}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-indigo-300 transition-all p-6"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-3xl font-semibold text-indigo-700 mb-1">{item.company}</h3>
              <a
                href={item.website}
                target="_blank"
                className="text-blue-600 text-xl break-words"
              >
                {item.website}
              </a>
              <p className="text-gray-600 mt-2 text-lg">{item.description}</p>

              <div className="mt-4">
                <span className="font-medium text-xl text-gray-700">İlgi Alanı:</span>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {item.subfields.map((field, i) => (
                    <li
                      key={i}
                      className="bg-indigo-100 text-indigo-700 px-2 py-3 rounded-full text-xs font-medium"
                    >
                      {field}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                onClick={() => handleSendRequest(item.email)}
                className="mt-8 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                İş Birliği İsteği Gönder
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
