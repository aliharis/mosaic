import { useServer } from "graphql-ws/lib/use/ws";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { schema } from "./schemas/index";
import { createContext } from "./context";
import { useAuth } from "./utils/auth";

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
  schema,
  graphiql: {
    subscriptionsProtocol: "WS",
  },
  context: createContext,
  plugins: [useAuth()],
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
server.listen(process.env.PORT || 4000, () => {
  console.info(`Server is running on port ${process.env.PORT || 4000}`);
});
