import { z } from "zod";
import { createTRPCRouter, staffProcedure, adminProcedure } from "../init";
import { db } from "@/db";
import { chatMessages, chatAttachments } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

export const teamChatRouter = createTRPCRouter({
  getMessages: staffProcedure.query(async () => {
    try {
      const messages = await db
        .select()
        .from(chatMessages)
        .orderBy(desc(chatMessages.createdAt))
        .limit(100);

      if (messages.length === 0) {
        return [];
      }

      // Fetch attachments for all messages
      const messageIds = messages.map((m) => m.id);
      const attachments = await db
        .select()
        .from(chatAttachments)
        .where(inArray(chatAttachments.messageId, messageIds));

      // Group attachments by messageId
      const attachmentsByMessage = attachments.reduce(
        (acc, attachment) => {
          if (!acc[attachment.messageId]) {
            acc[attachment.messageId] = [];
          }
          acc[attachment.messageId].push(attachment);
          return acc;
        },
        {} as Record<string, typeof attachments>,
      );

      // Fetch user data from Clerk
      const senderIds = [
        ...new Set(messages.map((message) => message.senderId)),
      ];

      const client = await clerkClient();

      const users = await Promise.all(
        senderIds.map(async (senderId) => {
          try {
            const user = await client.users.getUser(senderId);

            return {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              fullName: user.fullName,
              imageUrl: user.imageUrl,
            };
          } catch (error) {
            console.error(`Failed to fetch Clerk user ${senderId}:`, error);
            return null;
          }
        }),
      );

      const userMap = new Map(
        users
          .filter((user): user is NonNullable<typeof user> => user !== null)
          .map((user) => [user.id, user]),
      );

      return messages.reverse().map((message) => ({
        id: message.id,
        senderId: message.senderId,
        content: message.content,
        attachments: attachmentsByMessage[message.id] || [],
        createdAt: message.createdAt,
        sender: userMap.get(message.senderId) ?? null,
      }));
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
      return [];
    }
  }),

  sendMessage: staffProcedure
    .input(
      z.object({
        content: z.string().max(5000).default(""),
        attachments: z
          .array(
            z.object({
              fileName: z.string(),
              filePath: z.string(),
              fileType: z.string().optional(),
              fileSize: z.number().optional(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Insert the message first
        const message = await db
          .insert(chatMessages)
          .values({
            senderId: ctx.userId,
            content: input.content || "",
          })
          .returning();

        // If there are attachments, insert them into chatAttachments table
        if (input.attachments && input.attachments.length > 0) {
          await db.insert(chatAttachments).values(
            input.attachments.map((attachment) => ({
              messageId: message[0].id,
              fileName: attachment.fileName,
              filePath: attachment.filePath,
              fileType: attachment.fileType || null,
              fileSize: attachment.fileSize || null,
            })),
          );
        }

        return {
          success: true,
          message: message[0],
        };
      } catch (error) {
        console.error("Failed to send chat message:", error);

        return {
          success: false,
          message: null,
        };
      }
    }),

  deleteMessage: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Delete attachments first (will cascade automatically, but explicit is safer)
        await db
          .delete(chatAttachments)
          .where(eq(chatAttachments.messageId, input.id));

        // Delete the message
        const deleted = await db
          .delete(chatMessages)
          .where(eq(chatMessages.id, input.id))
          .returning();

        if (!deleted || deleted.length === 0) {
          return {
            success: false,
            message: "Message not found or already deleted",
          };
        }

        return {
          success: true,
          message: deleted[0],
        };
      } catch (error) {
        console.error("Failed to delete chat message:", error);

        return {
          success: false,
          message: null,
        };
      }
    }),
});
