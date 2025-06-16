export default function Footer() {
  return (
    <footer className="bg-black text-center text-gray-600 text-sm mt-auto">
      {/* Social media */}
      <section className="p-4">
        <div className="mb-4">Bizi sosyal medyada takip edin:</div>
        <div className="space-x-4">
          <a href="#"><i className="fab fa-facebook-f" /></a>
          <a href="#"><i className="fab fa-twitter" /></a>
          <a href="#"><i className="fab fa-instagram" /></a>
          <a href="#"><i className="fab fa-linkedin" /></a>
        </div>
      </section>

      {/* Info */}
      <section className="py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <h6 className="font-bold text-lg mb-2">TechRadar</h6>
            <p>Yapay zeka destekli büyüme asistanınız.</p>
          </div>
          <div>
            <h6 className="font-bold text-lg mb-2">Biz</h6>
            <p><a href="#" className="text-gray-300 hover:text-white">İletişim</a></p>
            <p><a href="#" className="text-gray-300 hover:text-white">Hakkımızda</a></p>
          </div>
          <div>
            <h6 className="font-bold text-lg mb-2">İletişim</h6>
            <p>📍 Şişli, İstanbul</p>
            <p>📧 seherkor2013@gmail.com</p>
            <p>📞 +90 555 008 2126</p>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <div className="bg-black py-3">
        © 2025 TechRadar. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
