import { useAuth } from "@clerk/clerk-react";
import { ClientContext } from "graphql-hooks";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { client } from "./utils/graphql-client";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait until Clerk is fully loaded
  if (!isLoaded) {
    return <div>Loading...</div>; // You can replace this with a better loading UI
  }

  // Redirect unauthorized users
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

function App() {
  return (
    <ClientContext.Provider value={client}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ClientContext.Provider>
  );
}

export default App;
