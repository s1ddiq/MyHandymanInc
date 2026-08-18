"use client";

import { Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function TeamChat() {
  const trpc = useTRPC();
  const { user } = useUser();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useQuery(trpc.teamChat.getMessages.queryOptions());

  const sendMessageMutation = useMutation(
    trpc.teamChat.sendMessage.mutationOptions({
      onSuccess: () => {
        setMessage("");
        refetch();
      },
    }),
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll to bottom when loading finishes
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const handleSend = () => {
    const content = message.trim();

    if (!content || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      content,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="shrink-0 border-b px-4 py-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Team Chat
        </h2>

        <p className="text-sm text-gray-500">Admin & Sales Team</p>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl bg-muted/40"
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200">
                No messages yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Start a conversation with your team.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMine = msg.senderId === user?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[85%] gap-2 ${
                      isMine ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    {msg.sender?.imageUrl ? (
                      <img
                        src={msg.sender.imageUrl}
                        alt={msg.sender.fullName ?? "Team member"}
                        className="h-8 w-8 shrink-0 rounded-full"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {msg.sender?.firstName?.[0] ?? "?"}
                      </div>
                    )}

                    <div>
                      {/* Name */}
                      {!isMine && (
                        <p className="mb-1 px-1 text-xs font-semibold text-muted-foreground">
                          {msg.sender?.fullName ??
                            msg.sender?.firstName ??
                            "Team member"}
                        </p>
                      )}

                      {/* Message */}
                      <div
                        className={`rounded-2xl px-3 py-2 ${
                          isMine
                            ? "rounded-br-sm bg-blue-500 text-white"
                            : "rounded-bl-sm bg-muted text-foreground"
                        }`}
                      >
                        <p className="break-words text-sm">{msg.content}</p>

                        <p
                          className={`mt-1 text-[10px] ${
                            isMine ? "text-white/50" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t p-3">
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendMessageMutation.isPending}
            placeholder="Message your team..."
            className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
