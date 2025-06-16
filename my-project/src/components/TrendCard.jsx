import { motion } from "framer-motion";

export default function TrendCard({ item, index }) {
  return (
      <motion.div
          initial={{opacity: 0, y: 40}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.4, delay: index * 0.1}}
          className="w-full flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-20 mb-10"
      >


        {/* Sol içerik kutusu */}
        <div className="bg-blue-900 text-white px-8 py-6 rounded-xl shadow-md w-full  ">
          <p className="text-sm opacity-80 mb-2">AI</p>
          <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline text-sm">
            Habere Git
          </a>
          <p className="text-xs mt-4 text-gray-300">Tarih: {new Date(item.publishedAt).toLocaleDateString()}</p>
        </div>


      </motion.div>
  );
}
