import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";

export const user = sqliteTable("User", {
  id: text("id").notNull().primaryKey().$defaultFn(v4),
  email: text("email").notNull(),
  password: text("password"),
  externalId: text("externalId"),
});

export type User = InferSelectModel<typeof user>;

export const chat = sqliteTable(
  "Chat",
  {
    id: text("id").notNull().primaryKey().$defaultFn(v4),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    messages: text("messages", { mode: "json" }).$type<Message[]>().notNull(),
    userId: text("userId").notNull(),
    systemPrompt: text("systemPrompt").notNull(),
    tools: text("tools", { mode: "json" }).notNull(),
    modelName: text("modelName").notNull(),
    modelProvider: text("modelProvider").notNull(),
  },
  (table) => {
    return {
      // For foreign keys in SQLite, the recommended Drizzle approach:
      chatUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "Chat_userId_User_id_fk",
      }),
    };
  }
);

export type Chat = InferSelectModel<typeof chat>;