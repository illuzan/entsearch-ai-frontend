// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ChatMessage from "../components/ChatMessage";
// import ChatInput from "../components/ChatInput";
// import api from "../api";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // const handleSend = async (text, sender) => {
//   //   setLoading(true);
//   //   setMessages((prev) => [...prev, { sender, text }]);
//   //   setLoading(false);

//   // };

//   const handleSend = async (text, sender) => {
//     // show user message
//     setMessages((prev) => [...prev, { sender, text }]);
//     setLoading(true);

//     try {
//       // call backend API
//       const res = await api.post("/sec-query", { query: text });

//       // add bot/AI response
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: res.data.answer },
//       ]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Something went wrong!" },
//       ]);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="w-full flex flex-col items-stretch p-4 space-y-3">
//       {/* Top buttons */}
//       <div className="flex justify-end p-2 space-x-2 bg-gray-100 border-b border-gray-300">
//         <button
//           className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           onClick={() => navigate("/login")}
//         >
//           Login
//         </button>
//         <button
//           className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
//           onClick={() => navigate("/signup")}
//         >
//           Signup
//         </button>
//       </div>

//       {/* Chat messages */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4">
//         {messages.map((msg, i) => (
//           <ChatMessage key={i} sender={msg.sender} text={msg.text} />
//         ))}
//         {loading && <p className="text-center text-gray-400">Thinking...</p>}
//       </div>

//       {/* Chat input */}
//       <ChatInput onSend={handleSend} />
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import api from "../api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (text, sender) => {
    setMessages((prev) => [...prev, { sender, text }]);
    setLoading(true);

    try {
      const res = await api.post("/sec-query", { query: text });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Something went wrong!" }]);
    }

    setLoading(false);
  };

  // Show scroll arrow if chat overflows
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // hide arrow if at bottom
      const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 1;
      setShowScroll(!atBottom);
    };

    // initial check
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  return (
    <div className="w-full flex flex-col items-stretch p-4 space-y-3 h-screen relative">
      {/* Top navbar */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-300 relative">
        {/* Left spacer */}
        <div className="w-1/3"></div>

        {/* Center website name */}
        <div className="w-1/3 text-center text-xl font-bold text-gray-800">
          Entsearch-AI
        </div>

        {/* Right buttons */}
        <div className="flex justify-end w-1/3 space-x-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </div>


      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatContainerRef}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <p className="text-center text-gray-400">Thinking...</p>}
      </div>

      {/* Scroll to bottom button */}
      {showScroll && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white text-black rounded-full p-3 shadow-lg hover:bg-blue-600 z-60"
        >
          ↓
        </button>
      )}

      {/* Chat input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
