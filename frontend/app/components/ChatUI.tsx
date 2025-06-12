"use client";

import { useEffect, useRef, useState } from "react";

interface ChatUIProps {
  theme: "light" | "dark";
  endpoint: string; // e.g. "mentor" or "learning"
}

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function ChatUI({ theme, endpoint }: ChatUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: "Hello! I'm evo – how can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const containerCls =
    theme === "dark"
      ? "bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)] text-white"
      : "bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_70%)] text-white";

  const bubbleBase =
    "max-w-[80%] rounded-lg px-4 py-3 whitespace-pre-wrap break-words shadow-md backdrop-blur-sm";
  const bubbleUser =
    theme === "dark"
      ? `self-end bg-blue/90 text-white border border-blue/30 ${bubbleBase}`
      : `self-end bg-gradient-to-br from-blue to-darkBlue text-white ${bubbleBase}`;
  const bubbleBot =
    theme === "dark"
      ? `self-start bg-blueGrey/80 text-white border border-blue/20 ${bubbleBase}`
      : `self-start bg-blueGrey/50 text-white/90 border border-darkBlue/30 ${bubbleBase}`;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const handleSend = async () => {
    if (!input.trim()) return;

    const userContent = input.trim();
    setInput("");

    // Add user message
    const userMsg: ChatMessage = { role: "user", content: userContent };
    setMessages((prev) => [...prev, userMsg]);

    // Add placeholder bot message so UI shows immediately
    setMessages((prev) => [...prev, { role: "bot", content: "" }]);

    try {
      const res = await fetch(`${API_BASE}/chat_stream/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userContent }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botReply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botReply += decoder.decode(value, { stream: true });

        // Update last bot message incrementally
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length && updated[updated.length - 1].role === "bot") {
            updated[updated.length - 1] = { role: "bot", content: botReply };
          }
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        role: "bot",
        content: "Sorry, an error occurred while contacting the server.",
      };
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length && updated[updated.length - 1].role === "bot") {
          updated[updated.length - 1] = errorMsg;
        } else {
          updated.push(errorMsg);
        }
        return updated;
      });
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full ${containerCls}`}>
      {/* Chat scroll area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? bubbleUser : bubbleBot}>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Floating input area */}
      <div className="px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center">
            <div className="flex-1 relative mt-4">
              <div className="absolute inset-0 rounded-xl bg-blue-500/30 blur-xl translate-y-6 scale-[0.9] opacity-95"></div>
              <div className="absolute inset-0 rounded-xl bg-blue-300/15 blur-md -translate-y-1"></div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full rounded-xl px-5 py-3 min-h-[60px] border-2 border-gray-800 focus:outline-none bg-black/95 text-white placeholder-gray-500 resize-none shadow-[0_0_20px_rgba(59,130,246,0.6),0_0_10px_rgba(37,99,235,0.5)] relative z-10"
                placeholder="Type a message and press Enter"
              />
              <button
                onClick={handleSend}
                className="absolute right-3 bottom-3 w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white z-20 hover:bg-blue-600"
                aria-label="Send message"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-4 h-4"
                >
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 