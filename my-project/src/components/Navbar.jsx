import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const menuStyle = "text-2xl text-white hover:text-indigo-300 transition-all ";

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
      { to: "/isbirligi-istekleri", label: "İşbirliği İstekleri" }, // 🔥 yeni sekme
      { to: "/company-list", label: "Etkinlikler" },
    ],
  },
];


  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-white text-5xl font-bold flex items-center gap-2">
          <span className="text-2xl"></span> TechRadar
        </Link>

        <Link to="/dashboard" className={menuStyle}>
          Anasayfa
        </Link>

        {menuItems.map((menu, index) => (
          <Menu as="div" className="relative" key={index}>
            <Menu.Button className={`${menuStyle} text-2xl inline-flex items-center gap-1`}>
              {menu.title} <ChevronDown className="w-4 h-4" />
            </Menu.Button>
            <Menu.Items className="absolute z-50 mt-2 bg-white rounded shadow text-gray-800 w-52 p-2 space-y-1 text-2xl">
              {menu.links.map((link, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <Link
                      to={link.to}
                      className={`text-2xl block px-2 py-1 rounded ${active ? "bg-gray-100" : ""}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        ))}
      </div>

      <div className="text-2xl flex items-center gap-4">
        <Link to="/profil" className={menuStyle}>
          Ayarlar
        </Link>
        <Link to="/" className={`${menuStyle} font-semibold`}>
          Çıkış
        </Link>
      </div>
    </nav>
 );
}