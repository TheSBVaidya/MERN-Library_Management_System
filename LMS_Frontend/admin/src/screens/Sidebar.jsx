import {
  HomeIcon,
  UsersIcon,
  BookIcon,
  BarChartIcon,
  SettingsIcon,
  UserPlusIcon,
  LogOutIcon,
} from "./IconComponents";

const Sidebar = ({ currentView, setView, onLogout }) => {
  const navItems = [
    { id: "dashboard", icon: HomeIcon, label: "Dashboard" },
    {
      id: "registerLibrarian",
      icon: UserPlusIcon,
      label: "Register Librarian",
    },
    { id: "manageMembers", icon: UsersIcon, label: "Manage Members" },
    // { id: "manageBooks", icon: BookIcon, label: "Manage Books" },
    // { id: "viewReports", icon: BarChartIcon, label: "View Reports" },
    { id: "settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "280px", height: "100vh" }}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span className="fs-4">Admin Panel</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li className="nav-item" key={item.id}>
            <button
              onClick={() => setView(item.id)}
              className={`nav-link text-white d-flex align-items-center w-100 ${
                currentView === item.id ? "active" : ""
              }`}
            >
              <item.icon
                className="me-2"
                style={{ width: "16px", height: "16px" }}
              />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <button
        onClick={onLogout}
        className="btn btn-outline-light d-flex align-items-center"
      >
        <LogOutIcon
          className="me-2"
          style={{ width: "16px", height: "16px" }}
        />
        Logout
      </button>
    </div>
  );
};
export default Sidebar;
