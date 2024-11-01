import { db } from "../config/database";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  CreateUserInput,
  LoginInput,
  LoginResponse,
  User,
} from "../types/graphql";
import { MyContext } from "../context";
import { JWT_SECRET } from "../config/auth";
import { sign } from "jsonwebtoken";

export default {
  Query: {
    users: async (
      parent: any,
      args: any,
      context: MyContext
    ): Promise<User[]> => {
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

    login: async (
      _: any,
      { input }: { input: LoginInput }
    ): Promise<LoginResponse> => {
      // THIS IS INTENTIONALLY INSECURE
      // TODO: Implement a proper authentication flow
      // For now, we'll just check if the user exists
      // and create a new one if they don't
      // There's no password hashing and authentication

      // Check if user exists
      let user = await db.query.users.findFirst({
        where: eq(users.name, input.name),
      });

      // If user doesn't exist, create a new one
      if (!user) {
        const [newUser] = await db
          .insert(users)
          .values({
            id: input.id,
            name: input.name,
            color: input.color,
            lastActive: input.lastActive,
          })
          .returning();
        user = newUser;
      }

      return {
        user: user,
        token: sign({ userId: user.id }, JWT_SECRET),
      };
    },
  },
};
