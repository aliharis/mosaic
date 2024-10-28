// src/index.ts
import { createServer } from "@graphql-yoga/node";
import { schema } from "./schemas";
import { context } from "./context";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;

const server = createServer({
  schema,
  context,
  port,
});

server.start().then(() => {
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
});
