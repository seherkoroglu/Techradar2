import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setChatLog((prev) => [...prev, { user: input }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        message: input,
      });
      setChatLog((prev) => [...prev, { bot: res.data.reply }]);
    } catch {
      setChatLog((prev) => [...prev, { bot: "⚠️ Yanıt alınamadı." }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, isTyping]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-100 text-sm text-gray-900">
        {chatLog.map((entry, idx) => (
          <div key={idx}>
            {entry.user && (
              <div className="flex justify-end gap-2">
                <div className="bg-green-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-[75%] break-words">{entry.user}</div>
              </div>
            )}
            {entry.bot && (
              <div className="flex justify-start gap-2">
                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none max-w-[75%] shadow break-words">{entry.bot}</div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-400 text-xs pl-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            <span className="ml-2">Yazıyor...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="px-3 py-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Mesajınızı yazın..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition text-sm"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
