import { useState } from "react";
// import { searchQuery } from "../api";

export default function ChatInput({ onSend }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setQuery(""); // clear input
    onSend(query, "user"); // only send user message
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-center gap-2 md:gap-3 w-full max-w-2xl mx-auto"
    >
      <input
        type="text"
        placeholder="Ask me anything about enterprise search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 w-full px-4 md:px-5 py-2 md:py-3 rounded-full border-2 border-slate-300 bg-white text-sm md:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
      />
      <button
        type="submit"
        disabled={!query.trim()}
        className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg btn-modern flex items-center justify-center md:justify-start gap-2"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-sm md:text-base">Send</span>
      </button>
    </form>
  );
}
