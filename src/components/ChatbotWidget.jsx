import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { sendMessage as sendChatMessage } from "../services/chatbot.service.js";

const STARTER_PROMPTS = [
  "Find 300 level Computer Science past questions",
  "Show me Engineering materials from 2022",
  "What materials are available for my department?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-1">
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

function MaterialChip({ id, title, courseCode }) {
  return (
    <Link
      to={`/materials/${id}`}
      className="mt-1.5 flex items-center gap-2 rounded-xl border border-campus-200 bg-campus-50 px-3 py-2 text-xs transition hover:bg-campus-100"
    >
      <span className="shrink-0 rounded-full bg-campus-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-campus-700">
        {courseCode || "—"}
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
      className={`flex items-end gap-2 px-4 py-1 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-campus-100">
          <Bot className="h-4 w-4 text-campus-700" />
        </div>
      )}
      <div className={`flex max-w-[80%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-[1.25rem] px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-sm bg-campus-600 text-white"
              : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
          }`}
        >
          {msg.content}
        </div>
        {msg.materials?.length > 0 && (
          <div className="mt-0.5 flex w-full flex-col">
            {msg.materials.map((m) => (
              <MaterialChip key={m.id} id={m.id} title={m.title} courseCode={m.courseCode} />
            ))}
          </div>
        )}
        <span className="mt-1 text-[10px] text-slate-400">{time}</span>
      </div>
    </Motion.div>
  );
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage(text) {
    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const previousMessages = messages.map(({ role, content }) => ({ role, content }));
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
          content: err.message || "Sorry, I encountered an error. Please try again.",
          materials: [],
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleSubmit(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;
    sendMessage(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-campus-900 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10">
                  <Bot className="h-5 w-5 text-sky-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Library Assistant</p>
                  <p className="text-[11px] text-sky-200/70">AI-powered academic helper</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 py-4">
              {isEmpty ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-campus-100">
                    <Bot className="h-7 w-7 text-campus-700" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    How can I help you today?
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    Ask me to find materials, past questions, or anything about the library.
                  </p>
                  <div className="mt-5 flex w-full flex-col gap-2">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="rounded-2xl border border-campus-200 bg-white px-4 py-2.5 text-left text-xs font-medium text-campus-700 transition hover:border-campus-300 hover:bg-campus-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} />
                  ))}
                  {typing && <TypingIndicator />}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 bg-white px-4 py-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={typing}
                  placeholder="Ask about materials…"
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-campus-300 focus:bg-white focus:ring-4 focus:ring-campus-100 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-campus-600 text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ──────────────────────────────────── */}
      <Motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-campus-600 text-white shadow-[0_8px_30px_rgba(35,72,118,0.4)] transition hover:bg-campus-700"
        aria-label={open ? "Close Library Assistant" : "Open Library Assistant"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <Motion.span
              key="x"
              initial={{ rotate: -80, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 80, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </Motion.span>
          ) : (
            <Motion.span
              key="chat"
              initial={{ rotate: 80, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -80, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="h-6 w-6" />
            </Motion.span>
          )}
        </AnimatePresence>
      </Motion.button>
    </>
  );
}

