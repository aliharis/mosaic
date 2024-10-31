import { useServer } from "graphql-ws/lib/use/ws";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { schema } from "./schemas/index";

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
  schema,
  graphiql: {
    subscriptionsProtocol: "WS",
  },
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga);

// Create WebSocket server
const wsServer = new WebSocketServer({
  server,
  path: yoga.graphqlEndpoint,
});

// Set up WebSocket server
useServer({ schema }, wsServer);

// Start the server and you're done!
server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
