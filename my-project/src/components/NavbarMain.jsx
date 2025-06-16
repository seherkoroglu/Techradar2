import { Link } from "react-router-dom";

export default function NavbarMain() {
  return (
<nav className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between">
    {/* Sol tarafta logo */}
    <div>
        <Link to="/" className="text-white text-5xl font-bold flex items-center gap-2">
           TechRadar
        </Link>
      </div>

      {/* Sağ tarafta butonlar */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-white text-2xl hover:text-indigo-300 transition font-semibold"
        >
          Giriş Yap
        </Link>
        <Link
          to="/register"
          className="text-white text-2xl hover:text-indigo-300 transition font-semibold"
        >
          Kayıt Ol
        </Link>
      </div>
    </nav>
  );
}
