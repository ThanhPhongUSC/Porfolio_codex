"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starters = [
  "What is Phong's experience with authentication?",
  "How did a PhD lead to software engineering?",
  "What kind of teams and products has Phong worked on?"
];

export default function DigitalTwin() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I am Phong's Digital Twin. Ask me about his career, technical experience, or the kind of product work he enjoys."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event?: FormEvent<HTMLFormElement>, prompt = input) {
    event?.preventDefault();
    const question = prompt.trim();

    if (!question || isLoading) return;

    const nextMessages = [...messages, { role: "user" as const, content: question }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok || !data.message) {
        throw new Error(data.error || "The Digital Twin is unavailable right now.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.message as string }
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The Digital Twin is unavailable right now."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="twin-console">
      <div className="twin-console-header">
        <div>
          <span className="twin-status" />
          Available for career questions
        </div>
        <span>AI PROFILE</span>
      </div>

      <div className="chat-log" aria-live="polite" aria-label="Digital Twin conversation">
        {messages.map((message, index) => (
          <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.role === "assistant" ? "PT" : "YOU"}</span>
            <p>{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant thinking">
            <span>PT</span>
            <p>Thinking<span className="typing-dots">...</span></p>
          </div>
        )}
      </div>

      <div className="starter-prompts" aria-label="Suggested questions">
        {starters.map((starter) => (
          <button key={starter} type="button" onClick={() => sendMessage(undefined, starter)} disabled={isLoading}>
            {starter}
          </button>
        ))}
      </div>

      <form className="chat-form" onSubmit={(event) => sendMessage(event)}>
        <label className="sr-only" htmlFor="twin-question">
          Ask Phong&apos;s Digital Twin
        </label>
        <input
          id="twin-question"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Phong's experience..."
          maxLength={600}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
      {error && <p className="chat-error" role="alert">{error}</p>}
    </div>
  );
}
