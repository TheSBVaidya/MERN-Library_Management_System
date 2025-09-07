import { useState } from "react";
import Spinner from "./Spinner";
import apiClient from "../api/ApiClient";

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("rohan.mehta@example.com");
  const [password, setPassword] = useState("hashed_password_for_rohan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // const API_URL = "http://localhost:3000/admin/adminLogin";
      const response = await apiClient.post("/adminLogin", { email, password });

      // console.log("BackEnd Response: " + response.data.data.name);
      const token = response.data?.data?.token;
      const name = response.data.data.name;
      // console.log("userName: " + name);

      if (token) {
        // localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        onLoginSuccess(token);
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (err) {
      console.log("Login Error: ", err);
      setError("Login Failed: Email or Password is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    // Main container to center the login form vertically and horizontally
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card border-0 rounded-4 shadow-lg">
          <div className="card-body p-4 p-md-5">
            <h3 className="card-title text-center mb-4 fw-bold">Welcome</h3>
            {/* Form Stars heare */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                {/* Email Input */}
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="emailLogin"
                  name="emailLogin"
                  id="emailLogin"
                  placeholder="Enter Email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="passwordLogin"
                  name="passwordLogin"
                  id="passwordLogin"
                  placeholder="Enter Password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              {/* Forgot Password
              <div className="d-flex justify-content-end mb-4">
                <a href="#">Forgot Password?</a>
              </div> */}

              {/* Button */}
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-4 gap-3"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Sign In"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline-secondary btn-lg px-4"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>

            <hr className="my-4" />
            <div className="text-center">
              <p className="mb-0">
                Don't have an account?{" "}
                <a href="#" className="fw-bold">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
