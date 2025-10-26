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

export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";

  const formatMessage = (msg) => {
    if (Array.isArray(msg)) {
      return msg
        .map(
          (item, i) => `
${i + 1}. ${item.companyName} (${item.ticker})
Form: ${item.form}
Filing Date: ${item.filingDate}
Accession Number: ${item.accessionNumber}

Summary: ${item.summary}

Financials:
- Revenue: ${item.financials?.revenue}
- Net Income: ${item.financials?.netIncome}

Key Initiatives:
${item.keyInitiatives?.map((k) => "- " + k).join("\n")}
`
        )
        .join("\n");
    }

    if (typeof msg === "object") return JSON.stringify(msg, null, 2);
    return msg;
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-2xl whitespace-pre-wrap shadow ${
          isUser
            ? "bg-blue-500 text-white max-w-[60%] text-right"
            : "bg-gray-200 text-black w-full"
        }`}
      >
        {formatMessage(text)}
      </div>
    </div>
  );
}
