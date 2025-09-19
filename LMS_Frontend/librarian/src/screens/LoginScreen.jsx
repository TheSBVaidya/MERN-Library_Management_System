import { useState } from "react";
import apiClient from "../api/ApiClient";
// import { useNavigate } from "react-router-dom";
import { UserIcon } from "../icons/iconComponent";

const LoginScreen = ({ onLoginSuccess }) => {
  // const navigate = useNavigate();
  const [email, setEmail] = useState("v.patel@example.com");
  const [password, setPassword] = useState("hashed_password_for_vikram");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  // let response;

  const handleCancel = () => {
    setPassword("");
    setEmail("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/loginLibrarian", {
        email,
        password,
      });

      const token = response.data.data.token;
      const name = response.data.data.name;

      if (token) {
        // localStorage.setItem("token", token);
        localStorage.setItem("name", name);

        onLoginSuccess(token);
        // navigate("/dashboard");
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      if (errorMsg === "0") {
        setError("User not found. Please check your email.");
      } else if (errorMsg === "-1") {
        setError("Incorrect password. Please try again.");
      } else if (errorMsg === "-2") {
        setError("Enter Correct Email or Password");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container to center the login form vertically and horizontally
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-8 col-lg-6 col-xl-4">
        <div className="card border-0 rounded-4 shadow-lg">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              {/* Simple User Icon */}
              <UserIcon className="bi bi-person-circle text-primary" />
              <h3 className="card-title mt-3 fw-bold">Welcome Back</h3>
              <p className="text-muted">Please sign in to continue</p>
            </div>

            {/* Form Stars heare */}
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Email"
                  className="form-control form-control-lg"
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Password"
                  className="form-control form-control-lg"
                />
              </div>

              {/* Forgot Password */}
              <div className="d-flex justify-content-end mb-4">
                <a href="#">Forgot Password?</a>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Button */}
              {/* Submit Button */}
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {" "}
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span className="ms-2">Logging In.....</span>
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
                {/* Cancel Button */}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
