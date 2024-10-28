import { ClientContext, GraphQLClient } from "graphql-hooks";
import Dashboard from "./pages/Dashboard";

const client = new GraphQLClient({
  url: "http://localhost:4000/graphql",
});

function App() {
  return (
    <ClientContext.Provider value={client}>
      <Dashboard />
    </ClientContext.Provider>
  );
}

export default App;
