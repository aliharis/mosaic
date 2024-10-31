import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Create a SQL query to enable the uuid-ossp extension
// I couldn't get this to work with drizzle-kit so I just run it manually before running the other commands
// https://github.com/drizzle-team/drizzle-orm/issues/1238
// export const createExtension = sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

// Add this constant for UUID generation
const generateUuid = sql`uuid_generate_v4()`;

export const blockTypeEnum = pgEnum("block_type", [
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "bulletList",
  "numberedList",
  "quote",
  "code",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(generateUuid),
  name: text("name").notNull(),
  color: text("color").notNull(),
  lastActive: timestamp("last_active").notNull().defaultNow(),
});

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().default(generateUuid),
  title: text("title").notNull(),
  content: text("content").notNull(),
  blocks: jsonb("blocks").notNull().$type<Block[]>().default([]),
  color: text("color").notNull(),
  version: integer("version").notNull().default(1),
  created: timestamp("created").notNull().defaultNow(),
  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),
  lastEdited: timestamp("last_edited").notNull().defaultNow(),
  lastEditedBy: uuid("last_edited_by")
    .references(() => users.id)
    .notNull(),
});

export const noteToUsers = pgTable("note_to_users", {
  noteId: uuid("note_id")
    .references(() => notes.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});

// Define relations
export const notesRelations = relations(notes, ({ many }) => ({
  activeUsers: many(noteToUsers),
}));

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(noteToUsers),
}));

export const noteToUsersRelations = relations(noteToUsers, ({ one }) => ({
  note: one(notes, {
    fields: [noteToUsers.noteId],
    references: [notes.id],
  }),
  user: one(users, {
    fields: [noteToUsers.userId],
    references: [users.id],
  }),
}));

// Types
export interface Block {
  id: string;
  type:
    | "paragraph"
    | "heading1"
    | "heading2"
    | "heading3"
    | "bulletList"
    | "numberedList"
    | "quote"
    | "code";
  content: string;
}

export const schemaWithRelations = {
  notes,
  users,
  noteToUsers,
  notesRelations,
  usersRelations,
  noteToUsersRelations,
};
