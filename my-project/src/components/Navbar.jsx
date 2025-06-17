import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const menuStyle = "text-xl text-white hover:text-indigo-300 transition-all";

  const menuItems = [
    {
      title: "Analizler",
      links: [
        { to: "/competitors", label: "Rakip Analizi" },
        { to: "/forecast", label: "Tahminler" },
        { to: "/pazar-trendleri", label: "Pazar Trendleri" },
        { to: "/articles", label: "İlgi Alanı Makaleleri" },
        { to: "/sirket-hisse", label: "Şirket Hisse Kartları" },
      ],
    },
    {
      title: "Strateji",
      links: [
        { to: "/yatirim-radar", label: "Yatırım Radar" },
        { to: "/tech-migrations", label: "Teknoloji Geçişleri" },
        { to: "/yetenek-haritasi", label: "Yetenek Haritası" },
      ],
    },
    {
      title: "Fikirler",
      links: [
        { to: "/products", label: "Ürün Envanteri" },
        { to: "/isbirligi-firsat", label: "İşbirliği Fırsatları" },
        { to: "/isbirligi-istekleri", label: "İşbirliği İstekleri" },
        { to: "/company-list", label: "Etkinlikler" },
      ],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-white text-3xl font-bold">
        TechRadar
      </Link>

      {/* Hamburger icon (mobile only) */}
      <div className="md:hidden text-white" onClick={toggleMobile}>
        {mobileOpen ? <X size={32} /> : <MenuIcon size={32} />}
      </div>

      {/* Menu (desktop) */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/dashboard" className={menuStyle}>Anasayfa</Link>

        {menuItems.map((menu, index) => (
          <Menu as="div" className="relative" key={index}>
            <Menu.Button className={`${menuStyle} inline-flex items-center gap-1`}>
              {menu.title} <ChevronDown className="w-4 h-4" />
            </Menu.Button>
            <Menu.Items className="absolute z-50 mt-2 bg-white rounded shadow text-gray-800 w-52 p-2 space-y-1">
              {menu.links.map((link, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <Link
                      to={link.to}
                      className={`block px-2 py-1 rounded ${active ? "bg-gray-100" : ""}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        ))}

        <Link to="/profil" className={menuStyle}>Ayarlar</Link>
        <Link to="/" className={`${menuStyle} font-semibold`}>Çıkış</Link>
      </div>

      {/* Menu (mobile) */}
      {mobileOpen && (
        <div className="absolute top-20 left-0 w-full bg-gray-900 text-white px-6 py-4 flex flex-col gap-4 md:hidden z-40">
          <Link to="/dashboard" onClick={toggleMobile}>Anasayfa</Link>
          {menuItems.map((menu, index) => (
            <div key={index}>
              <p className="font-semibold mb-1">{menu.title}</p>
              {menu.links.map((link, i) => (
                <Link key={i} to={link.to} onClick={toggleMobile} className="block ml-4 text-gray-300 hover:text-indigo-400">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <Link to="/profil" onClick={toggleMobile}>Ayarlar</Link>
          <Link to="/" onClick={toggleMobile}>Çıkış</Link>
        </div>
      )}
    </nav>
  );
}
