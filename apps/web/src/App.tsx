import { ClientContext, GraphQLClient } from "graphql-hooks";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Splash } from "./components/common/Splash";
import { client } from "./utils/graphql-client";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Splash />;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <ClientContext.Provider value={client}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ClientContext.Provider>
  );
}

export default App;
