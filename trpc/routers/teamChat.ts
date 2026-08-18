import { z } from "zod";
import { createTRPCRouter, staffProcedure, adminProcedure } from "../init";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

export const teamChatRouter = createTRPCRouter({
  getMessages: staffProcedure.query(async () => {
    try {
      const messages = await db
        .select()
        .from(chatMessages)
        .orderBy(desc(chatMessages.createdAt))
        .limit(100);

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
        ...message,
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
        content: z.string().trim().min(1).max(5000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const message = await db
          .insert(chatMessages)
          .values({
            senderId: ctx.userId,
            content: input.content,
          })
          .returning();

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

  deleteMessage: staffProcedure
    .input(
      z.object({
        id: z.string().uuid(), // Changed from z.number() to z.string().uuid()
      }),
    )
    .mutation(async ({ input }) => {
      try {
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
