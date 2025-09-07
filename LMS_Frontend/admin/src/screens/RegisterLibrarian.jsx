import { useState } from "react";
import apiClient from "../api/ApiClient";

const RegisterLibrarian = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsError(true);
      return;
    }
    setIsLoading(true);

    try {
      // payload
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await apiClient.post("/addLibrarian", payload);

      const status = response.data.status;

      if (status === "success") {
        console.log("success: " + response.data.status);
        setMessage(`Successfully registered ${formData.name}!`);
        setIsError(false);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } else if (status === "error") {
        console.log("Error: " + response.data.status);
        const errorMessage = response?.data?.message.sqlMessage;
        setMessage(errorMessage);
        setIsError(true);
      }
    } catch (error) {
      console.log(error);
      console.log("Error: " + response.data.status);
      const errorMessage =
        error.response?.data?.message.sqlMessage ||
        "An unexpected error occurred.";
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="h2 mb-4">Register a New Librarian</h1>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            {message && (
              <div
                className={`alert ${
                  isError ? "alert-danger" : "alert-success"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control form-control-lg"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control form-control-lg"
                required
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="password" className="form-label fw-bold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="confirmPassword" className="form-label fw-bold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary btn-lg">
                Register Librarian
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterLibrarian;
