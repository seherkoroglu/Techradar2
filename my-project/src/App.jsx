import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";         // ✅ Home ekledik
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Competitor from "./pages/CompetitorPage";
import CompanyList from "./pages/CompanyList";
import ArticlesPage from "./pages/ArticlesPage";
import Forecast from "./pages/Forecast";
import PazarTrendleri from "./pages/PazarTrendleri"; // ✅ doğru path
import ProductIdeas from "./pages/ProductIdeas.jsx";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import YatirimRadar from "./pages/YatirimRadar.jsx";
import TechMigrations from "./pages/TechMigrations.jsx";
import ProductList from "./pages/ProductList";
import TahminSayfasi from "./pages/SirketHisse"; // yol senin yapına göre değişebilir
import IsbirligiFirsatlari from "./pages/IsbirligiFirsatlari.jsx"
import IsbirligiIstekleri from "./pages/IsbirligiIstekleri.jsx";
import ChatWidget from "./components/ChatWidget";
import SkillMapAI from './pages/SkillMapAI'; // yol senin dosya yapına göre değişebilir
import Profil from "./pages/Profil.jsx";





function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(false);
useEffect(() => {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true"; // ✅ küçük harf i ile
  setIsLoggedIn(loggedIn);
}, []);


  return (
    <BrowserRouter>
      <div className="">


        <main >
          <Routes>
            <Route path="/" element={<Home />} /> {/* ✅ Ana sayfayı Home yaptık */}
            <Route path="/login" element={<Login />} /> {/* Login ayrı path */}
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/company-list" element={<CompanyList />} />
<Route path="/competitors" element={<Competitor />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/forecast" element={<Forecast />} />
              <Route path="/pazar-trendleri" element={<PazarTrendleri />} />
              <Route path="/urun-fikirleri" element={<ProductIdeas />} />
                            <Route path="/yatirim-radar" element={<YatirimRadar />} />
                                          <Route path="/tech-migrations" element={<TechMigrations />} />
              <Route path="/products" element={<ProductList />} />
<Route path="/sirket-hisse" element={<TahminSayfasi />} />
              <Route path="/isbirligi-firsat" element={<IsbirligiFirsatlari/>} />
<Route path="/admin-login" element={<AdminLogin />} />
<Route path="/admin-dashboard" element={<AdminDashboard />} />
<Route path="/isbirligi-istekleri" element={<IsbirligiIstekleri />} />
              <Route path="/yetenek-haritasi" element={<SkillMapAI />} />
<Route path="/profil" element={<Profil />} />


          </Routes>
        </main>

        <Footer />
        {isLoggedIn && <ChatWidget />}
      </div>
    </BrowserRouter>
  );
}

export default App;
