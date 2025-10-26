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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!query.trim()) return;

  //   // Send user query to parent
  //   onSend(query, "user");

  //   try {
  //     const result = await searchQuery(query);
  //     // Send bot response to parent
  //     onSend(result.answer || JSON.stringify(result), "bot");
  //   } catch (err) {
  //     console.error(err);
  //     onSend("Something went wrong!");
  //   }

  //   setQuery(""); // clear input
  // };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex p-4 mx-40 bg-white"
    >
      <input
        type="text"
        placeholder="Type your query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border border-black p-2 rounded-xl focus:outline-none"
      />
      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-xl"
      >
        Search
      </button>
    </form>
  );
}
