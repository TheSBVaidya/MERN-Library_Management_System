import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import Dashboard from "./screens/Dashboard";
import { useEffect, useState } from "react";
import Sidebar from "./screens/sidebar";
import Placeholder from "./screens/Placeholder";
import AddBook from "./screens/AddBook";
import ManageBook from "./screens/ManageBook";
import Payments from "./screens/Payments";

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
    localStorage.removeItem("name");
  };

  if (!token) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "addBook":
        return <AddBook />;
      case "manageBook":
        return <ManageBook />;
      case "payments":
        return <Payments />;
      case "settings":
        return <Placeholder title="Settings" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<LoginScreen />} />
    //     <Route path="/dashboard" element={<Dashboard />} />
    //   </Routes>
    // </Router>
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
