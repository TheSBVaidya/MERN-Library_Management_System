import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginScreen = () => {
  const [email, setEmail] = useState("v.patel@example.com");
  const [password, setPassword] = useState("hashed_password_for_vikram");
  const navigate = useNavigate();

  const handleCancel = () => {
    setName("");
    setPhone("");
    setPassword("");
    setEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const librarianLogin = {
        email: email,
      password: password,
    };

    try {
      const API_URL = "http://localhost:3000/librarian/loginLibrarian";
      const response = await axios.post(API_URL, librarianLogin);
      console.log(response.data);
      const res = response.data.message;
      if (res === "0") {
        alert("User Not Found");
      } else if (res === "-1") {
        alert("Wrong Password");
      } else if (res === "-2") {
        alert("Enter Correct Email or Password");
      }

      // alert("Hello " + response.data.data.role);
      navigate("/dashboard");
    } catch (err) {
      alert(err);
    }
  };

  return (
    // Main container to center the login form vertically and horizontally
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card border-0 rounded-4 shadow-lg">
          <div className="card-body p-4 p-md-5">
            <h3 className="card-title text-center mb-4 fw-bold">Welcome</h3>
            {/* Form Stars heare */}
            <form>
              {/* Email Input */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="emailLogin"
                  name="emailLogin"
                  id="emailLogin"
                  placeholder="Enter Email"
                  className="form-control form-control-lg"
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="passwordLogin"
                  name="passwordLogin"
                  id="passwordLogin"
                  placeholder="Enter Password"
                  className="form-control form-control-lg"
                />
              </div>

              {/* Forgot Password */}
              <div className="d-flex justify-content-end mb-4">
                <a href="#">Forgot Password?</a>
              </div>

              {/* Button */}
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                >
                  Login
                </button>
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
