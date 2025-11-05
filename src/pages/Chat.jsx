import { useState, useRef, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import UserProfile from "../components/UserProfile";
import api, { setMsalInstance } from "../api";

export default function Chat() {
  const { instance } = useMsal();
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatContainerRef = useRef(null);

  // Initialize MSAL instance for token refresh
  useEffect(() => {
    if (instance) {
      setMsalInstance(instance);
    }
  }, [instance]);

  // Fetch threads from backend API on mount
  useEffect(() => {
    const fetchThreads = async () => {
      setThreadsLoading(true);
      try {
        const response = await api.get("/threads");
        if (response.data.success && response.data.threads) {
          // Transform API response to match the thread structure
          const fetchedThreads = response.data.threads.map((thread) => ({
            id: thread.id,
            title: `Thread ${thread.id.substring(7, 15)}`, // Use shortened thread ID as title
            messages: [],
            createdAt: thread.created_at,
          }));

          // Sort threads by creation date (newest first)
          fetchedThreads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setThreads(fetchedThreads);
          // Load the first thread by default
          if (fetchedThreads.length > 0) {
            setSelectedThreadId(fetchedThreads[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      } finally {
        setThreadsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  // Save threads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatThreads", JSON.stringify(threads));
  }, [threads]);

  // Create a new chat thread
  const handleNewChat = () => {
    const newThread = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setSelectedThreadId(newThread.id);
    setMessages([]);
  };

  // Select a thread
  const handleSelectThread = (threadId) => {
    const thread = threads.find((t) => t.id === threadId);
    if (thread) {
      setSelectedThreadId(threadId);
      setMessages(thread.messages || []);
    }
  };

  // Delete a thread
  const handleDeleteThread = (threadId) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (selectedThreadId === threadId) {
      if (threads.length > 1) {
        const remainingThread = threads.find((t) => t.id !== threadId);
        setSelectedThreadId(remainingThread.id);
        setMessages(remainingThread.messages || []);
      } else {
        setSelectedThreadId(null);
        setMessages([]);
      }
    }
  };

  const handleSend = async (text, sender) => {
    const newMessages = [...messages, { sender, text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // API call with MSAL token (attached via interceptor in api.js)
      const res = await api.post("/search", { prompt: text });
      const botMessage = { sender: "bot", text: res.data.message };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);

      // Update thread with new messages and title if it's the first message
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === selectedThreadId) {
            return {
              ...thread,
              messages: updatedMessages,
              title: thread.title === "New Chat" ? text.substring(0, 30) + (text.length > 30 ? "..." : "") : thread.title,
            };
          }
          return thread;
        })
      );
    } catch (err) {
      console.error(err);
      const errorMessage = { sender: "bot", text: "Something went wrong! Please try again." };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);

      // Update thread with error message
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === selectedThreadId) {
            return {
              ...thread,
              messages: updatedMessages,
            };
          }
          return thread;
        })
      );
    }

    setLoading(false);
  };

  // Show scroll arrow if chat overflows
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 1;
      setShowScroll(!atBottom);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Scroll to bottom
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  return (
    <div className="w-full flex h-screen bg-white flex-col md:flex-row">
      {/* Left Sidebar - Mobile: full screen overlay, Desktop: fixed width */}
      <div className={`${
        sidebarOpen
          ? "w-full md:w-64 translate-x-0"
          : "w-full md:w-0 -translate-x-full md:translate-x-0"
      } fixed md:static top-0 left-0 bottom-0 z-40 bg-blue-50 border-r border-blue-100 flex flex-col transition-all duration-300 overflow-hidden shadow-lg md:shadow-xs`}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-blue-100 flex items-center justify-between gap-2">
          <button
            onClick={handleNewChat}
            className="flex-1 px-4 py-2 bg-linear-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm"
          >
            + New Chat
          </button>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-blue-100">
          <input
            type="text"
            placeholder="Search your threads..."
            className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-xs"
          />
        </div>

        {/* Threads list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs font-semibold text-blue-600 uppercase px-3 py-2 tracking-wide">All Threads</div>

          {/* Loading state */}
          {threadsLoading ? (
            <div className="flex flex-col gap-3 p-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-blue-100 animate-pulse">
                  <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No threads found</p>
            </div>
          ) : (
            <>
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleSelectThread(thread.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                selectedThreadId === thread.id
                  ? "bg-blue-200 text-blue-900 shadow-md"
                  : "hover:bg-blue-100 text-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">{thread.title}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {thread.createdAt
                      ? new Date(thread.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Unknown date'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteThread(thread.id);
                  }}
                  className="ml-2 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
            </>
          )}
        </div>

        {/* User profile in sidebar - with better spacing */}
        <div className="p-4 border-t border-blue-100 bg-linear-to-b from-transparent to-blue-50 shadow-xs">
          <UserProfile />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Top navbar */}
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-linear-to-r from-blue-500 via-blue-400 to-blue-500 shadow-lg border-b border-blue-300 gap-2">
          {/* Toggle sidebar - visible on mobile and desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-blue-400 p-2 rounded-lg transition-all duration-200 hover:shadow-md shrink-0"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Center website name - responsive text */}
          <div className="text-center flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-white truncate">Agentic AI</h1>
            <p className="text-blue-100 text-xs hidden md:block font-medium mt-1">Enterprise Search Intelligence</p>
          </div>

          {/* Right spacer */}
          <div className="w-8 md:w-10 shrink-0"></div>
        </div>

        {/* Chat messages container */}
        <div
          className="flex-1 overflow-y-auto px-3 md:px-8 py-4 md:py-8 space-y-3 md:space-y-4 smooth-scroll bg-linear-to-b from-blue-50 via-white to-blue-50"
          ref={chatContainerRef}
        >
          {/* Empty state */}
          {messages.length === 0 && !loading && (
            <div className="h-full flex items-center justify-center px-4">
              <div className="text-center">
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">💬</div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Start a Conversation</h2>
                <p className="text-sm md:text-base text-slate-600 max-w-md">
                  Ask me anything about enterprise search and get intelligent insights powered by AI.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <ChatMessage key={i} sender={msg.sender} text={msg.text} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-blue-100 rounded-3xl px-5 py-3 message-bubble shadow-md">
                <div className="typing-indicator flex space-x-2">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll to bottom button */}
        {showScroll && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 md:bottom-32 right-4 md:right-8 bg-white text-blue-500 rounded-full p-2 md:p-3 shadow-xl hover:shadow-2xl hover:bg-blue-50 btn-modern z-50 border-2 border-blue-200 transition-all duration-200"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Chat input */}
        <div className="px-3 md:px-8 py-4 md:py-6 bg-white border-t border-blue-100 shadow-xs">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
