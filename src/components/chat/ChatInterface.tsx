"use client";

import React, { useEffect, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import ChatDataCopyButton from "./ChatDataCopyButton";
import secureLocalStorage from "react-secure-storage";
import { useSession } from "next-auth/react";
import { useUsersQuery } from "@/hooks/useUsersQuery";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import { useTablesQuery } from "@/hooks/useTablesQuery";

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

  const { data: users } = useUsersQuery(userAuthenticatedID);
  const { data: projects } = useProjectsQuery(userAuthenticatedID);
  const { data: tables } = useTablesQuery(userAuthenticatedID);

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

    // TODO: Implement localLLM
    setTimeout(() => {
      // Context to add: Hi! Thanks again for helping out. I always appreciate it. Again, I need you to have a look at my security controls for compliance and regulations.
      const assistantMessage: Message = {
        role: "llm",
        content: "Test message.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const copyDataToClipboard = (dataToBeCopied: string) => {
    const plain = new Blob([dataToBeCopied], { type: "text/plain" });
    const data = new ClipboardItem({
      "text/plain": plain,
    });
    navigator.clipboard.write([data]);
  };

  const clearChat = () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      secureLocalStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex flex-col justify-between md:h-[calc(100svh-20rem)]">
      <div className="flex flex-col text-center md:text-left items-center gap-1 md:gap-0 md:items-stretch md:grid md:grid-cols-[57%_43%] border-b pb-2">
        <div>
          <h2 className="text-2xl font-bold">Mistral-7B-v0.3</h2>
          <p className="text-sm text-muted-foreground">
            You have full control over your data. Your chat history is saved as
            an encrypted LocalStorage, and is not sent to our server.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="grid grid-cols-3 gap-1">
            <ChatDataCopyButton
              label="Copy MFA status as JSON"
              onClickCopyData={() =>
                copyDataToClipboard(JSON.stringify(users, null, 4))
              }
            />
            <ChatDataCopyButton
              label="Copy PITR status as JSON"
              onClickCopyData={() =>
                copyDataToClipboard(JSON.stringify(projects, null, 4))
              }
            />
            <ChatDataCopyButton
              label="Copy RLS status as JSON"
              onClickCopyData={() =>
                copyDataToClipboard(JSON.stringify(tables, null, 4))
              }
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col align-bottom">
        <div className="flex flex-col justify-end pt-2 pb-2 pl-1 min-h-[calc(100svh-23rem)] md:h-[calc(100svh-23rem)]">
          <div className="overflow-y-auto whitespace-pre-wrap">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex pb-2 pr-0.5 md:pr-5 text-[0.7rem] ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg py-2 px-4 ${
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
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 px-4">
                  <div className="flex gap-1">
                    <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce" />
                    <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="sticky md:static bottom-0 md:bottom-0 pt-4 pb-4 m:pb-0 pl-1 border-t bg-background"
        >
          <div className="flex gap-2 justify-between pb-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
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
              className="text-[0.7rem] w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary whitespace-pre-wrap"
            />
            {/*  First, put padding in messages. Second, make them smaller text and smaller padding.            */}
            {/*  Then, scroll frame in desktop view and infinite scroll  */}
            <button
              type="submit"
              disabled={isLoading || !input}
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
