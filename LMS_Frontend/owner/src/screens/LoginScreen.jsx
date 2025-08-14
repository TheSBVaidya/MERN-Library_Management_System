const LoginScreen = () => {
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
                <button type="button" className="btn btn-primary btn-lg">
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
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
