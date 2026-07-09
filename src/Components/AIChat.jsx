import React, { useState, useRef, useEffect } from "react";
import { answerQuestion } from "../ai-brain.mjs";
import { BrainIcon } from "./Icons";

const STARTERS = [
  "What is Oscar's current job?",
  "What projects has he built?",
  "What cloud platforms does he know?",
];

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'ready'
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm Oscar's AI assistant. Ask me anything about his experience, skills, or projects.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const pipelineRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const wasOpenRef = useRef(false);

  // Load model when panel first opens
  useEffect(() => {
    if (!open || status !== "idle") return undefined;
    setStatus("loading");

    let cancelled = false;

    const load = async () => {
      try {
        const { pipeline, env } = await import("@xenova/transformers");
        env.allowLocalModels = false;

        const model = await pipeline(
          "question-answering",
          "Xenova/distilbert-base-cased-distilled-squad",
          {
            progress_callback: (info) => {
              if (cancelled) return;
              if (info.status === "progress" && info.total) {
                setProgress(Math.round((info.loaded / info.total) * 100));
              }
            },
          }
        );

        if (!cancelled) {
          pipelineRef.current = model;
          setStatus("ready");
          setProgress(100);
        }
      } catch {
        if (!cancelled) {
          setStatus("idle");
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: "Could not load the AI model. Check your connection and try again." },
          ]);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [open]);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Focus input when ready
  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  // Close on Escape, and trap Tab/Shift+Tab focus inside the panel while open
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), [href]'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Return focus to the trigger button when the panel closes
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  const ask = async (question) => {
    if (!question.trim() || status !== "ready" || thinking) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setThinking(true);

    try {
      const { answer } = await answerQuestion(question, (q, context) =>
        pipelineRef.current(q, context)
      );
      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        ref={triggerRef}
        className={`ai-chat-trigger${open ? " active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        title="Ask Oscar's AI"
      >
        <span className="ai-chat-trigger-icon" aria-hidden="true"><BrainIcon size={28} /></span>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="ai-chat-panel"
          role="dialog"
          aria-modal="true"
          aria-label="AI Portfolio Assistant"
        >
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <span className="ai-chat-avatar"><BrainIcon size={22} /></span>
              <div>
                <strong>Ask Oscar</strong>
                <span className="ai-chat-status-dot">
                  {status === "ready" ? "● Online" : status === "loading" ? "● Loading…" : "● Offline"}
                </span>
              </div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>

          {/* Loading bar */}
          {status === "loading" && (
            <div className="ai-chat-loading">
              <p className="ai-chat-loading-label">Loading AI model ({progress}%)</p>
              <div className="ai-chat-progress-track">
                <div className="ai-chat-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <p className="ai-chat-loading-hint">First visit only — cached after this.</p>
            </div>
          )}

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-chat-msg ai-chat-msg--${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {thinking && (
              <div className="ai-chat-msg ai-chat-msg--bot ai-chat-thinking">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Starters (shown before any user message) */}
          {status === "ready" && messages.filter((m) => m.role === "user").length === 0 && (
            <div className="ai-chat-starters">
              {STARTERS.map((s) => (
                <button key={s} className="ai-chat-starter-btn" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="ai-chat-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="ai-chat-input"
              type="text"
              placeholder={status === "ready" ? "Ask a question…" : "Loading AI model…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready" || thinking}
              autoComplete="off"
            />
            <button
              type="submit"
              className="ai-chat-send"
              disabled={status !== "ready" || thinking || !input.trim()}
              aria-label="Send"
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChat;
