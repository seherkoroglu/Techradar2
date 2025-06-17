import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { X } from "lucide-react";
import ChatBot from "../pages/ChatBot.jsx";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[90vw] max-w-md h-[90vh] bg-white border shadow-xl rounded-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-2 flex justify-between items-center">
            <h2 className="text-sm font-bold">TechBot</h2>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">
              <X size={20} />
            </button>
          </div>

          {/* İçerik */}
          <ChatBot />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
