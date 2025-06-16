import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";


export default function IsbirligiIstekleri() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [activeTab, setActiveTab] = useState("sent");

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [sentRes, receivedRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/collaboration/sent-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/collaboration/received-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const sentData = await sentRes.json();
      const receivedData = await receivedRes.json();

      setSent(sentData);
      setReceived(receivedData);
    } catch (error) {
      console.error("İstekler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collaboration/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          request_id: requestId,
          new_status: status,
        }),
      });

      const data = await res.json();
      alert(data.message);
      fetchRequests();
    } catch (err) {
      console.error("Durum güncellenemedi", err);
    }
  };

  const renderTable = (data, type) => (
    <div className="overflow-x-auto transition-all duration-500 animate-fade-in">
      <table className="w-full border text-sm shadow-md">
        <thead className="bg-indigo-600 text-white text-left text-xs uppercase">
          <tr>
            <th className="px-4 py-3">Gönderen</th>
            <th className="px-4 py-3">Alıcı</th>
            <th className="px-4 py-3">Tarih</th>
            <th className="px-4 py-3">Durum</th>
            {type === "received" && <th className="px-4 py-3">Aksiyon</th>}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((item, i) => (
            <tr key={i} className="border-t hover:bg-indigo-50 transition">
              <td className="px-4 py-2">{item.sender_email}</td>
              <td className="px-4 py-2">{item.receiver_email}</td>
              <td className="px-4 py-2">
                {new Date(item.timestamp).toLocaleString("tr-TR")}
              </td>
              <td className="px-4 py-2 font-medium capitalize">{item.status}</td>
              {type === "received" && (
                <td className="px-4 py-2 space-x-2">
                  {item.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(String(item._id), "accepted")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                      >
                        Kabul Et
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(String(item._id), "rejected")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        Reddet
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">Yanıtlandı</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
      <>
        <Navbar/>
        <section className="relative w-full h-[93vh] flex items-center justify-center text-white overflow-hidden">
          {/* Blur arka plan görseli */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
              style={{
                backgroundImage: "url('/images/isbirligi.png')",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          ></div>

          {/* Yazı içeriği */}
          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">İş Birliği İstekleri</h1>
            <p className="text-xl md:text-2xl font-medium opacity-95 drop-shadow">
Tüm iş birliği tekliflerinizi buradan görüntüleyebilir, gelen istekleri onaylayabilir veya reddedebilirsiniz.
            </p>
          </div>
        </section>
        <div className=" px-6 py-10 max-w-6xl mx-auto font-inter text-xl leading-relaxed">

          <div className="flex gap-4 mb-6 text-lg">
            {["sent", "received"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-lg font-semibold transition 
                ${
                        activeTab === tab
                            ? "bg-indigo-600 text-white shadow-md text-lg "
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 text-lg"
                    }`}
                >
                  {tab === "sent" ? "Gönderilen İstekler" : "Alınan İstekler"}
                </button>
            ))}
          </div>

          {activeTab === "sent"
              ? renderTable(sent, "sent")
              : renderTable(received, "received")}
        </div>
      </>
  );
}
