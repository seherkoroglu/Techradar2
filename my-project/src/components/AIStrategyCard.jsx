import { motion } from "framer-motion";

export default function AIStrategyCard({ text, image, index }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`w-full flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-20 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Metin kutusu */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-blue-900 text-white px-8 py-6 rounded-xl shadow-md w-full md:w-1/2 hover:shadow-2xl cursor-pointer"
      >
        <h3 className="text-2xl font-bold mb-4">{text}</h3>
      </motion.div>

      {/* Görsel kutusu */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-full md:w-1/2 h-[280px] rounded-xl shadow-md overflow-hidden hover:shadow-2xl cursor-pointer"
      >
        <img
          src={image}
          alt="Strateji görseli"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );
}
