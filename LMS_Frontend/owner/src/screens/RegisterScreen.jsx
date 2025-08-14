import { use, useState } from "react";
import axios from "axios";

const RegisterScreen = () => {
  const [name, setName] = useState("Sanjay");
  const [email, setEmail] = useState("sanjay@gmail.com");
  const [phone, setPhone] = useState("1234567890");
  const [password, setPassword] = useState("sa180");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registerUser = {
      name: name,
      phone: phone,
      email: email,
      password: password,
    };

    try {
      const API_URL = "http://localhost:3000/members/register";
      const response = await axios.post(API_URL, registerUser);
      console.log(response);
      setMessage("User Register Successfully");
      handleCancel();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleCancel = () => {
    setName("");
    setPhone("");
    setPassword("");
    setEmail("");
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card border-0 rounded-4 shadow-lg">
          <div className="card-body p-4 p-md-5">
            <h3 className="card-title text-center mb-4 fw-bold">
              Registration
            </h3>
            {/* Form Stars heare */}
            <form>
              {/* Name Input */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="name"
                  name="name"
                  id="name"
                  placeholder="Enter Name"
                  className="form-control form-control-lg"
                />
              </div>

              {/* Phone Input */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="phone"
                  name="phone"
                  id="phone"
                  placeholder="Enter Phone"
                  className="form-control form-control-lg"
                />
              </div>

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
              <div className="mb-3">
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
              {/* Button */}
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={handleSubmit}
                >
                  Register
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

export default RegisterScreen;
