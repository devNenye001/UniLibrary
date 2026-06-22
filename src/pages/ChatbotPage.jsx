import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import LecturerLayout from "../components/lecturer/LecturerLayout.jsx";
import StudentLayout from "../components/student/StudentLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { sendMessage as sendChatMessage } from "../services/chatbot.service.js";

const STARTER_PROMPTS = [
  "Find 300 level Computer Science past questions",
  "Show me Engineering materials from 2022",
  "What materials are available for my department?",
];

function RoleLayout({ role, children }) {
  if (role === "admin") return <AdminLayout>{children}</AdminLayout>;
  if (role === "lecturer") return <LecturerLayout>{children}</LecturerLayout>;
  return <StudentLayout>{children}</StudentLayout>;
}

function MaterialChip({ id, title, courseCode }) {
  return (
    <Link
      to={`/materials/${id}`}
      className="mt-1.5 flex items-center gap-2 rounded-xl border border-campus-200 bg-campus-50 px-3 py-2 text-xs transition hover:bg-campus-100"
    >
      <span className="shrink-0 rounded-full bg-campus-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-campus-700">
        {courseCode || "-"}
      </span>
      <span className="line-clamp-1 font-medium text-slate-700">{title}</span>
    </Link>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-campus-100">
          <Bot className="h-4 w-4 text-campus-700" />
        </div>
      ) : null}
      <div className={`flex max-w-[85%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-[1.25rem] px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-sm bg-campus-600 text-white"
              : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
          }`}
        >
          {msg.content}
        </div>
        {msg.materials?.length ? (
          <div className="mt-0.5 flex w-full flex-col">
            {msg.materials.map((material) => (
              <MaterialChip
                key={material.id}
                id={material.id}
                title={material.title}
                courseCode={material.courseCode}
              />
            ))}
          </div>
        ) : null}
        <span className="mt-1 text-[10px] text-slate-400">{time}</span>
      </div>
    </Motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-campus-100">
        <Bot className="h-4 w-4 text-campus-700" />
      </div>
      <div className="flex items-center gap-1.5 rounded-[1.25rem] rounded-bl-sm border border-slate-200 bg-white px-4 py-3">
        {[0, 1, 2].map((i) => (
          <Motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            className="block h-1.5 w-1.5 rounded-full bg-campus-600"
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const { role } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.title = "GoLibrary | Chat Assistant";
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function sendMessage(text) {
    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    const previousMessages = messages.map(({ role: messageRole, content }) => ({
      role: messageRole,
      content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const { reply, materials } = await sendChatMessage(text, previousMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, materials, timestamp: Date.now() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "Sorry, I encountered an error while processing your request. Please try again.",
          materials: [],
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;
    sendMessage(trimmed);
  }

  return (
    <RoleLayout role={role}>
      <div className="flex flex-col h-[calc(100vh-4.5rem)] bg-slate-50/50">
        {/* Message Area */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length ? (
              <>
                {messages.map((msg, index) => (
                  <MessageBubble key={index} msg={msg} />
                ))}
                {typing ? <TypingIndicator /> : null}
              </>
            ) : (
              /* ChatGPT Empty State */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-campus-600 text-white shadow-lg">
                  <Bot className="h-8 w-8" />
                </div>

                {/* Starter Prompts Grid inside Chat Area */}
                <div className="mt-12 w-full max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Starter prompts</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-xs font-semibold text-slate-700 shadow-sm transition hover:border-campus-300 hover:bg-slate-50 hover:shadow-md"
                        onClick={() => sendMessage(prompt)}
                        type="button"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Area (ChatGPT Style Pill) */}
        <div className="bg-gradient-to-t from-slate-50 to-slate-50/0 px-4 py-6">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={typing}
                placeholder="Ask about materials..."
                className="w-full rounded-[2rem] border border-slate-200 bg-white py-4 pl-6 pr-14 text-sm shadow-sm outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-2.5 text-center text-[10px] text-slate-400">
              Library Assistant can make mistakes. Verify matching course codes and session details.
            </p>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
}
