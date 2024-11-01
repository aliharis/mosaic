import { db } from "@/config/database";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Add these types
type User = {
  id: string;
  name: string;
  color: string;
  lastActive: Date;
};

type CreateUserInput = {
  id: string;
  name: string;
  color: string;
  lastActive: Date;
};

export default {
  Query: {
    users: async (): Promise<User[]> => {
      return await db.query.users.findMany();
    },

    user: async (_: any, { id }: { id: string }): Promise<User | null> => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      return user ?? null;
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: CreateUserInput }
    ): Promise<User> => {
      const [user] = await db
        .insert(users)
        .values({
          id: input.id,
          name: input.name,
          color: input.color,
          lastActive: input.lastActive,
        })
        .returning();
      return user;
    },
  },
};
