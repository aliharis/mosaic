import { pgTable, uuid, text, integer, timestamp, jsonb, foreignKey, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const blockType = pgEnum("block_type", ['paragraph', 'heading1', 'heading2', 'heading3', 'bulletList', 'numberedList', 'quote', 'code'])



export const notes = pgTable("notes", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	color: text().notNull(),
	version: integer().default(1).notNull(),
	lastEdited: timestamp("last_edited", { mode: 'string' }).defaultNow().notNull(),
	blocks: jsonb().default([]).notNull(),
});

export const noteToUsers = pgTable("note_to_users", {
	noteId: uuid("note_id").notNull(),
	userId: uuid("user_id").notNull(),
},
(table) => {
	return {
		noteToUsersNoteIdNotesIdFk: foreignKey({
			columns: [table.noteId],
			foreignColumns: [notes.id],
			name: "note_to_users_note_id_notes_id_fk"
		}),
		noteToUsersUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "note_to_users_user_id_users_id_fk"
		}),
	}
});

export const users = pgTable("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: text().notNull(),
	color: text().notNull(),
	lastActive: timestamp("last_active", { mode: 'string' }).defaultNow().notNull(),
});
