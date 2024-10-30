import { GraphQLClient } from "graphql-hooks";

export const client = new GraphQLClient({
  url: "http://localhost:4000/graphql",
});
