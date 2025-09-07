import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import apiClient from "../api/ApiClient";

const ManageMembers = () => {
  const [userType, setUserType] = useState("librarians"); // 'members' or 'librarians'
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");

    try {
      let response;
      const role = userType === "librarians" ? "librarian" : "user";

      if (searchTerm) {
        response = await apiClient.get("/getbyName", {
          params: {
            name: searchTerm,
            role: role,
          },
        });
        console.log(response.data);
      } else {
        const endpoint = `/getAll/${role}`;
        response = await apiClient.get(endpoint);
      }

      if (response.data && response.data.status === "success") {
        setUsers(response.data.data);
      } else {
        setUsers([]);
        setError(
          `Failed to fetch ${userType}: ${
            response.data || `No ${userType} found.`
          }`
        );
      }
    } catch (err) {
      setUsers([]);
      setError(`Failed to fetch ${userType}. Please try again.`);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    console.log(userId);
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await apiClient.patch(`/deleteMember/${userId}`);

      if (response.data && response.data.status === "success") {
        alert("Member Deleted Successfully");
        fetchUsers();
      } else {
        setError(response.data.message || "Member could not be deleted.");
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or userType changes
  useEffect(() => {
    setSearchTerm("");
    fetchUsers();
  }, [userType]); // Re-fetch when userType changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const tableHeaders =
    userType === "librarians"
      ? ["Librarian ID", "Name", "Email", "Contact", "Actions"]
      : ["Member ID", "Name", "Email", "Contact", "Actions"];

  return (
    <>
      <h1 className="h2 mb-4">Manage Users</h1>
      {/* Filter and Search Bar */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <select
                  className="form-select form-select-lg"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="members">Members</option>
                  <option value="librarians">Librarians</option>
                </select>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-2 d-grid">
                <button type="submit" className="btn btn-primary btn-lg">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* User List Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {isLoading && (
            <div className="text-center p-4">
              <Spinner />
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          {!isLoading && !error && (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    {tableHeaders.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          {/* <button className="btn btn-sm btn-outline-secondary me-2">
                            Edit
                          </button> */}
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={tableHeaders.length}
                        className="text-center text-muted"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageMembers;
