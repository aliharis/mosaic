import { GraphQLClient } from "graphql-hooks";
import { createClient } from "graphql-ws";

export const client = new GraphQLClient({
  url: import.meta.env.VITE_GRAPHQL_API_URL,
  subscriptionClient: () =>
    createClient({
      url: import.meta.env.VITE_GRAPHQL_WS_API_URL,
    }),
});
