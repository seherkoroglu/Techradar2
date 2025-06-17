import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function NavbarMain() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-white text-4xl md:text-5xl font-bold">
        TechRadar
      </Link>

      {/* Hamburger menu (mobile) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-3xl focus:outline-none"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Normal menü (desktop) */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          to="/login"
          className="text-white text-xl hover:text-indigo-300 transition font-semibold"
        >
          Giriş Yap
        </Link>
        <Link
          to="/register"
          className="text-white text-xl hover:text-indigo-300 transition font-semibold"
        >
          Kayıt Ol
        </Link>
      </div>

      {/* Açılır menü (mobile) */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center gap-4 py-6 md:hidden">
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-white text-xl hover:text-indigo-300 transition font-semibold"
          >
            Giriş Yap
          </Link>
          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className="text-white text-xl hover:text-indigo-300 transition font-semibold"
          >
            Kayıt Ol
          </Link>
        </div>
      )}
    </nav>
  );
}
