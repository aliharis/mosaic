import { GraphQLClient } from "graphql-hooks";
import { createClient } from "graphql-ws";

export const client = new GraphQLClient({
  url: "http://localhost:4000/graphql",
  subscriptionClient: () =>
    createClient({
      url: "ws://localhost:4000/graphql",
      /* additional config options */
    }),
});
