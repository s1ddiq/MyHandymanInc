"use client";

import { Send, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useConfirmation } from "@/hooks/use-confirmation";

export default function TeamChat() {
  const trpc = useTRPC();
  const { user } = useUser();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

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

  const deleteMessageMutation = useMutation(
    trpc.teamChat.deleteMessage.mutationOptions({
      onSuccess: () => {
        toast.success("Message deleted");
        refetch();
      },
      onError: (error: any) => {
        if (error.data?.code === "FORBIDDEN") {
          toast.error("You don't have permission to delete messages");
          return;
        }
        toast.error(error?.message ?? "Failed to delete message");
      },
    }),
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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

  // Check for new messages and send notification
  useEffect(() => {
    const prevLength = prevMessagesLengthRef.current;

    if (
      messages.length > prevLength &&
      prevLength > 0 &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      // Get the newest message(s)
      const newMessages = messages.slice(prevLength);

      newMessages.forEach((msg) => {
        // Don't notify for your own messages
        if (msg.senderId === user?.id) return;

        const senderName =
          msg.sender?.fullName ?? msg.sender?.firstName ?? "Team member";

        const notification = new Notification("New Team Chat Message", {
          body: `${senderName}: ${msg.content}`,
          icon: msg.sender?.imageUrl || "/favicon.ico",
        });

        // Auto-close notification after 5 seconds
        setTimeout(() => notification.close(), 5000);

        // Focus window when notification is clicked
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      });
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, user?.id]);

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

  const handleDeleteMessage = (msg: any) => {
    confirm({
      title: "Delete Message",
      description: `Are you sure you want to delete this message from ${msg.sender?.fullName ?? msg.sender?.firstName ?? "Team member"}?`,
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteMessageMutation.mutateAsync({
          id: msg.id,
        });
      },
    });
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
                  className={`group flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-full gap-2 ${
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

                    <div className="relative min-w-0 flex-1">
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
                        className={`inline-block max-w-full rounded-2xl px-3 py-2 ${
                          isMine
                            ? "rounded-br-sm bg-blue-500 text-white"
                            : "rounded-bl-sm bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">
                          {msg.content}
                        </p>

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

                      {/* Delete button - visible on hover, only for admin */}
                      <button
                        onClick={() => handleDeleteMessage(msg)}
                        className={`absolute -top-2 ${
                          isMine ? "-left-8" : "-right-8"
                        } hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-all hover:bg-red-600 group-hover:flex group-hover:opacity-100`}
                        title="Delete message"
                      >
                        <Trash2 size={12} />
                      </button>
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

      <ConfirmationDialog />
    </aside>
  );
}
