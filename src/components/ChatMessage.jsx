// export default function ChatMessage({ sender, text }) {
//   const isUser = sender === "user";

//   // If text is an object, pretty-print it
//   const displayText =
//     typeof text === "object"
//       ? JSON.stringify(text, null, 2)
//       : text;

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
//       <div
//         className={`p-3 rounded-2xl max-w-md whitespace-pre-wrap ${
//           isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
//         }`}
//       >
//         {displayText}
//       </div>
//     </div>
//   );
// }

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";

//   const formatMessage = (msg) => {
//     if (Array.isArray(msg)) {
//       return msg
//         .map(
//           (item, i) => `
// ${i + 1}. ${item.companyName} (${item.ticker})
// Form: ${item.form}
// Filing Date: ${item.filingDate}
// Accession Number: ${item.accessionNumber}

// Summary: ${item.summary}

// Financials:
// - Revenue: ${item.financials?.revenue}
// - Net Income: ${item.financials?.netIncome}

// Key Initiatives:
// ${item.keyInitiatives?.map((k) => "- " + k).join("\n")}
// `
//         )
//         .join("\n");
//     }

//     if (typeof msg === "object") return JSON.stringify(msg, null, 2);
//     return msg;
//   };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} message-appear px-2`}>
      <div
        className={`px-3 md:px-5 py-2 md:py-3 rounded-2xl md:rounded-3xl message-bubble ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white max-w-[85%] md:max-w-[65%] rounded-br-none shadow-md hover:shadow-lg"
            : "bg-slate-100 text-slate-900 max-w-[90%] md:max-w-[70%] rounded-bl-none shadow-sm hover:shadow-md border border-slate-200"
        }`}
      >
        <span className={`text-xs md:text-sm font-medium ${isUser ? "block mb-1 opacity-80" : "hidden"}`}>
          You
        </span>
        <div className={`text-sm md:text-base leading-relaxed ${isUser ? "text-white" : "text-slate-800"}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p {...props} className="mb-2" />,
              h1: ({ node, ...props }) => <h1 {...props} className="text-lg font-bold mb-2" />,
              h2: ({ node, ...props }) => <h2 {...props} className="text-base font-bold mb-2" />,
              h3: ({ node, ...props }) => <h3 {...props} className="text-sm font-bold mb-1" />,
              ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside mb-2" />,
              ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside mb-2" />,
              li: ({ node, ...props }) => <li {...props} className="mb-1" />,
              code: ({ node, inline, ...props }) => (
                inline ? (
                  <code {...props} className={`px-1.5 py-0.5 rounded text-sm font-mono ${isUser ? "bg-blue-400" : "bg-slate-200"}`} />
                ) : (
                  <pre {...props} className={`p-2 rounded mb-2 overflow-x-auto text-xs font-mono ${isUser ? "bg-blue-400" : "bg-slate-200"}`} />
                )
              ),
              blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 pl-3 mb-2 italic opacity-75" />,
              a: ({ node, ...props }) => <a {...props} className="underline hover:opacity-75" />,
              table: ({ node, ...props }) => <table {...props} className="w-full border-collapse border border-current mb-2 text-xs" />,
              thead: ({ node, ...props }) => <thead {...props} />,
              tbody: ({ node, ...props }) => <tbody {...props} />,
              tr: ({ node, ...props }) => <tr {...props} />,
              th: ({ node, ...props }) => <th {...props} className="border border-current px-2 py-1 font-bold text-left" />,
              td: ({ node, ...props }) => <td {...props} className="border border-current px-2 py-1" />,
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
