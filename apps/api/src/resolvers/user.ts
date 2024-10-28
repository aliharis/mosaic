import { db } from "../config/database";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export default {
  Query: {
    users: async () => {
      return await db.query.users.findMany();
    },
    user: async (_, { id }) => {
      return await db.query.users.findFirst({
        where: eq(users.id, id),
      });
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const [user] = await db
        .insert(users)
        .values({
          name: input.name,
          color: input.color,
        })
        .returning();
      return user;
    },
  },
};
