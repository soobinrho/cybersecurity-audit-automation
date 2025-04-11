"use client";

import React, { useEffect, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import secureLocalStorage from "react-secure-storage";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LLMHeader from "@/components/chat/LLMHeader";
interface Message {
  role: "user" | "llm";
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const { data: session } = useSession();
  const userAuthenticatedID = session?.user?.id || "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages from encrypted localStorage
  const STORAGE_KEY = `caa_chat_messages_${userAuthenticatedID}`;
  useEffect(() => {
    if (userAuthenticatedID && typeof window !== "undefined") {
      const messagesJson = JSON.parse(
        String(secureLocalStorage.getItem(STORAGE_KEY))
      ) as Message[];
      if (messagesJson && messagesJson.length > 0) {
        const messages: Message[] = [];
        for (const message of messagesJson) {
          messages.push({
            role: message.role,
            content: message.content,
            timestamp: new Date(message.timestamp),
          });
        }
        setMessages(messages);
      }
    }
  }, [userAuthenticatedID, STORAGE_KEY]);

  // Save encrypted messages to localStorage
  useEffect(() => {
    if (messages.length > 0 && typeof window !== "undefined") {
      scrollToBottom();
      if (userAuthenticatedID) {
        secureLocalStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    }
  }, [messages, userAuthenticatedID, STORAGE_KEY, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Connect to real API once I get some credit.
    const randomTimeout = Math.random() * 3000;
    setTimeout(() => {
      // Context to add: Hi! Thanks again for helping out. I always appreciate it. Again, I need you to have a look at my security controls for compliance and regulations.
      const assistantMessage: Message = {
        role: "llm",
        content:
          "I don't have any credit in Claude, OpenAI, or Perplexity. Leaving this to your imagination for now :)",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, randomTimeout);
  };

  const clearChat = () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      secureLocalStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <article className="grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)_10%] md:grid-rows-[15%_minmax(0,1fr)_15%] grid text-xs md:text-[1rem] whitespace-pre-wrap text-pretty">
      <section className="invisible hidden md:visible md:row-start-1 md:row-end-2 grid-rows-subgrid md:grid border-b-[0.08rem] border-dashed">
        <LLMHeader userAuthenticatedID={userAuthenticatedID} />
      </section>
      <section className="row-start-1 row-end-2 md:row-start-2 md:row-end-3 grid-cols-subgrid grid-rows-subgrid grid border-b-[0.08rem] border-dashed">
        <ScrollArea className="px-5 mx-2">
          <div className="md:invisible md:hidden">
            <LLMHeader userAuthenticatedID={userAuthenticatedID} />
          </div>
          <div className="flex flex-col gap-1 justify-end">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`pb-2 pr-0.5 md:pr-5 max-w-2xs md:max-w-lg xl:max-w-3xl ${
                  message.role === "user" ? "self-end" : "self-start"
                }`}
              >
                <div
                  className={`rounded-lg py-2 px-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <span className="text-[0.5rem] opacity-70 pt-1 block">
                    {message.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted rounded-lg p-3 px-4 self-start">
                <div className="flex gap-1">
                  <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </section>
      <form
        className="relative row-start-2 row-end-3 md:row-start-3 md:row-end-4 grid-cols-subgrid grid-rows-subgrid grid"
        onSubmit={handleSubmit}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (!isLoading && e.key === "Enter" && !e.shiftKey) {
              const target = e.target as HTMLTextAreaElement;
              if (target.value === "/clear") {
                e.preventDefault();
                clearChat();
              } else {
                e.preventDefault();
                handleSubmit(e);
              }
              setInput("");
            }
          }}
          placeholder={
            messages.length > 0
              ? "Enter your message... Type /clear to clear your chat history."
              : "Enter your message..."
          }
          className="relative rounded-4xl border-2 border-solid pl-8 pr-12  py-1 md:py-4 mx-2 my-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        ></textarea>
        <button
          type="submit"
          disabled={isLoading || !input}
          className="absolute right-8 top-[50%] translate-y-[-50%] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <SendIcon />
        </button>
      </form>
    </article>
  );
}
