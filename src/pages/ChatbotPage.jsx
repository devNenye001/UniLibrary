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
    document.title = "UniLibrary | Chat Assistant";
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
      <div className="px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Library Assistant
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Chat with UniLibrary</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            Ask for materials, past questions, course notes, or recommendations and get direct
            links to matching documents.
          </p>
        </div>

        <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-campus-100">
              <Bot className="h-6 w-6 text-campus-700" />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-900">Starter prompts</p>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Use one of these to get quick results from the assistant.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  className="rounded-2xl border border-campus-200 bg-campus-50 px-4 py-3 text-left text-sm font-medium text-campus-700 transition hover:border-campus-300 hover:bg-campus-100"
                  onClick={() => sendMessage(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-campus-900 px-6 py-5">
              <p className="text-sm font-semibold text-white">Library Assistant</p>
              <p className="mt-1 text-xs text-sky-200/80">
                Search the library in plain language and open results directly.
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-6 py-6">
              {messages.length ? (
                <>
                  {messages.map((msg, index) => (
                    <MessageBubble key={index} msg={msg} />
                  ))}
                  {typing ? <TypingIndicator /> : null}
                </>
              ) : (
                <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-campus-100">
                    <Bot className="h-8 w-8 text-campus-700" />
                  </div>
                  <p className="mt-5 text-lg font-semibold text-slate-900">
                    Start a conversation
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
                    Ask about documents by course code, department, level, or topic and the
                    assistant will suggest matching materials.
                  </p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-slate-200 bg-white px-6 py-4">
              <form className="flex items-center gap-3" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none transition focus:border-campus-300 focus:bg-white focus:ring-4 focus:ring-campus-100 disabled:opacity-50"
                  disabled={typing}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about materials..."
                  value={input}
                />
                <button
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-campus-600 text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!input.trim() || typing}
                  type="submit"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </RoleLayout>
  );
}
