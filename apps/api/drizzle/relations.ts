import { relations } from "drizzle-orm/relations";
import { notes, noteToUsers, users } from "./schema";

export const noteToUsersRelations = relations(noteToUsers, ({one}) => ({
	note: one(notes, {
		fields: [noteToUsers.noteId],
		references: [notes.id]
	}),
	user: one(users, {
		fields: [noteToUsers.userId],
		references: [users.id]
	}),
}));

export const notesRelations = relations(notes, ({many}) => ({
	noteToUsers: many(noteToUsers),
}));

export const usersRelations = relations(users, ({many}) => ({
	noteToUsers: many(noteToUsers),
}));