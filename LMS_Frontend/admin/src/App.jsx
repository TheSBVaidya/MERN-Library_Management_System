import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import LoginScreen from "./screens/LoginScreen";
import Placeholder from "./screens/Placeholder";
import { useEffect, useState } from "react";
import Sidebar from "./screens/Sidebar";
import Dashboard from "./screens/Dashboard";
import RegisterLibrarian from "./screens/RegisterLibrarian";
import ManageMembers from "./screens/ManageMembers";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "registerLibrarian":
        return <RegisterLibrarian />;
      case "manageMembers":
        return <ManageMembers />;
      // case "manageBooks":
      //   return <Placeholder title="Manage Books" />;
      // case "viewReports":
      //   return <Placeholder title="View Reports" />;
      case "settings":
        return <Placeholder title="Settings" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className="d-flex"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        onLogout={handleLogout}
      />
      <main className="flex-grow-1 p-4 overflow-auto">{renderView()}</main>
    </div>
  );
}

export default App;
