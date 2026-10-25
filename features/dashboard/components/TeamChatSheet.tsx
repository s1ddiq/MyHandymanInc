"use client";

import {
  Image as ImageIcon,
  MessageSquare,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useConfirmation } from "@/hooks/use-confirmation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ChatAttachment = {
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
};

export default function TeamChatSheet() {
  const trpc = useTRPC();
  const { user } = useUser();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useQuery({
    ...trpc.teamChat.getMessages.queryOptions(),
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  const sendMessageMutation = useMutation(
    trpc.teamChat.sendMessage.mutationOptions({
      onSuccess: async () => {
        setMessage("");
        setAttachments([]);
        await refetch();

        window.setTimeout(() => inputRef.current?.focus(), 50);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send message");
      },
    }),
  );

  const deleteMessageMutation = useMutation(
    trpc.teamChat.deleteMessage.mutationOptions({
      onSuccess: async () => {
        toast.success("Message deleted");
        await refetch();
      },
      onError: (error) => {
        if (error.data?.code === "FORBIDDEN") {
          toast.error("You don't have permission to delete messages");
          return;
        }

        toast.error(error.message || "Failed to delete message");
      },
    }),
  );

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) scrollToBottom();
  }, [isLoading]);

  useEffect(() => {
    const previousLength = previousMessagesLengthRef.current;

    if (
      messages.length > previousLength &&
      previousLength > 0 &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      const newMessages = messages.slice(previousLength);

      newMessages.forEach((msg) => {
        if (msg.senderId === user?.id) return;

        const senderName =
          msg.sender?.fullName ?? msg.sender?.firstName ?? "Team member";
        const hasAttachment = Boolean(msg.attachments?.length);

        const notification = new Notification("New Team Chat Message", {
          body: hasAttachment
            ? `${senderName} sent an attachment`
            : `${senderName}: ${msg.content ?? ""}`,
          icon: msg.sender?.imageUrl || "/favicon.ico",
        });

        window.setTimeout(() => notification.close(), 5000);

        notification.onclick = () => {
          window.focus();
          notification.close();
          setOpen(true);
        };
      });
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages, user?.id]);

  async function uploadFiles(files: File[]) {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("Only image files can be attached.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("files", file));

      const response = await fetch(
        "/api/2z6KjCbKBdwRo4CUxmxWfx1bK38VXhHEp-upload",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Upload failed");
      }

      const result = await response.json();
      setAttachments((current) => [...current, ...result.files]);
      toast.success(`${result.files.length} image(s) attached`);
    } catch (error) {
      console.error("Error uploading chat images:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    function handleGlobalPaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items;
      if (!items) return;

      const imageItems = Array.from(items).filter((item) =>
        item.type.startsWith("image/"),
      );

      if (imageItems.length === 0) return;

      event.preventDefault();

      const files = imageItems
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) void uploadFiles(files);
    }

    document.addEventListener("paste", handleGlobalPaste);

    return () => {
      document.removeEventListener("paste", handleGlobalPaste);
    };
  }, []);

  function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (files?.length) {
      void uploadFiles(Array.from(files));
    }

    event.target.value = "";
  }

  function handleSend() {
    const content = message.trim();

    if (
      (!content && attachments.length === 0) ||
      sendMessageMutation.isPending ||
      isUploading
    ) {
      return;
    }

    sendMessageMutation.mutate({
      content,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleDeleteMessage(msg: (typeof messages)[number]) {
    const senderName =
      msg.sender?.fullName ?? msg.sender?.firstName ?? "Team member";

    confirm({
      title: "Delete Message",
      description: `Are you sure you want to delete this message from ${senderName}?`,
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteMessageMutation.mutateAsync({ id: msg.id });
      },
    });
  }

  function removeAttachment(index: number) {
    setAttachments((current) => current.filter((_, i) => i !== index));
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" />
          Open Chat
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-full flex-col border-l bg-white p-0 dark:bg-zinc-900 sm:max-w-md"
      >
        <SheetHeader className="shrink-0 border-b px-4 py-3 pr-12">
          <SheetTitle>Team Chat</SheetTitle>
          <SheetDescription>
            Admin, Sales &amp; Development Team
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 md:p-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
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
                <p className="mt-1 text-xs text-gray-400">
                  Tip: Paste images with Ctrl+V
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isMine = msg.senderId === user?.id;
                const senderName =
                  msg.sender?.fullName ??
                  msg.sender?.firstName ??
                  "Team member";

                return (
                  <div
                    key={msg.id}
                    className={`group flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-full gap-2 ${
                        isMine ? "flex-row-reverse" : ""
                      }`}
                    >
                      {msg.sender?.imageUrl ? (
                        <img
                          src={msg.sender.imageUrl}
                          alt={senderName}
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {msg.sender?.firstName?.[0] ?? "?"}
                        </div>
                      )}

                      <div className="relative min-w-0 flex-1">
                        {!isMine && (
                          <p className="mb-1 px-1 text-xs font-semibold text-muted-foreground">
                            {senderName}
                          </p>
                        )}

                        <div
                          className={`inline-block max-w-full rounded-2xl px-3 py-2 ${
                            isMine
                              ? "rounded-br-sm bg-blue-500 text-white"
                              : "rounded-bl-sm bg-muted text-foreground"
                          }`}
                        >
                          {msg.content && (
                            <p className="whitespace-pre-wrap break-words text-sm">
                              {msg.content}
                            </p>
                          )}

                          {msg.attachments?.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {msg.attachments.map((attachment, index) => (
                                <img
                                  key={`${attachment.filePath}-${index}`}
                                  src={attachment.filePath}
                                  alt={attachment.fileName}
                                  className="max-h-48 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-90"
                                  onClick={() =>
                                    window.open(
                                      attachment.filePath,
                                      "_blank",
                                      "noopener,noreferrer",
                                    )
                                  }
                                />
                              ))}
                            </div>
                          )}

                          <p
                            className={`mt-1 text-[10px] ${
                              isMine ? "text-white/70" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg)}
                          className={`absolute -top-2 ${
                            isMine ? "-left-8" : "-right-8"
                          } hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-all hover:bg-red-600 group-hover:flex group-hover:opacity-100`}
                          title="Delete message"
                          aria-label="Delete message"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {attachments.length > 0 && (
          <div className="shrink-0 border-t p-3">
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <div
                  key={`${attachment.filePath}-${index}`}
                  className="relative"
                >
                  <img
                    src={attachment.filePath}
                    alt={attachment.fileName}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    aria-label={`Remove ${attachment.fileName}`}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="shrink-0 border-t p-3">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sendMessageMutation.isPending || isUploading}
              placeholder={
                isUploading
                  ? "Uploading..."
                  : "Message your team... (Ctrl+V for image)"
              }
              className="min-w-0 flex-1 rounded-xl"
            />

            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Attach image"
              aria-label="Attach image"
            >
              <ImageIcon size={17} />
            </Button>

            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              disabled={
                (!message.trim() && attachments.length === 0) ||
                sendMessageMutation.isPending ||
                isUploading
              }
              aria-label="Send message"
            >
              <Send size={17} />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        <ConfirmationDialog />
      </SheetContent>
    </Sheet>
  );
}
