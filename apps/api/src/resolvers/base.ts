// src/resolvers/base.ts
import { version } from "../../package.json";

export default {
  Query: {
    healthCheck: () => ({
      status: "ok",
      timestamp: new Date().toISOString(),
      version,
    }),
  },

  Mutation: {
    ping: () => "pong",
  },

  Subscription: {
    keepAlive: {
      subscribe: async function* () {
        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 30000));
          yield { keepAlive: true };
        }
      },
    },
  },
};
