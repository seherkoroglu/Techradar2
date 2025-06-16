import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";

export default function Profil() {
  const [user, setUser] = useState({
    company: "",
    website: "",
    sector: "",
    subfields: [],
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.email) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/me/me/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Profil bilgilerin başarıyla güncellendi.");
    } else {
      setMessage(data.detail || "Bir hata oluştu.");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-black py-10 px-4">
      <div className="max-w-5xl text-center mx-auto p-8 bg-white mt-10 rounded shadow space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700">Profil Bilgileri</h1>

        <label className="block text-left">
          Şirket Adı
          <input
            className="w-full border rounded p-2 mt-1"
            name="company"
            value={user.company}
            onChange={handleChange}
          />
        </label>

        <label className="block text-left">
          Web Sitesi
          <input
            className="w-full border rounded p-2 mt-1"
            name="website"
            value={user.website}
            onChange={handleChange}
          />
        </label>

        <label className="block text-left">
          Sektör
          <input
            className="w-full border rounded p-2 mt-1"
            name="sector"
            value={user.sector}
            onChange={handleChange}
          />
        </label>

        <label className="block text-left">
          Alt Alanlar (virgülle ayırın)
          <input
            className="w-full border rounded p-2 mt-1"
            name="subfields"
            value={user.subfields.join(", ")}
            onChange={(e) =>
              setUser({ ...user, subfields: e.target.value.split(",").map(s => s.trim()) })
            }
          />
        </label>

        <label className="block text-left">
          Açıklama
          <textarea
            className="w-full border rounded p-2 mt-1"
            name="description"
            rows={3}
            value={user.description}
            onChange={handleChange}
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 text-white px-10 py-2 rounded hover:bg-indigo-700"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>

        {message && (
          <p className="text-green-600 text-sm mt-2">✅ {message}</p>
        )}
      </div>
    </div>
  </>
);
}
