import React, { useState } from "react";
import "../login/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../../Service/Url";
import { FaArrowLeftLong } from "react-icons/fa6";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = () => {
    setIsLoading(true);

    fetch(`${BaseUrl}/user/user-login`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);

        if (data.success) {
          localStorage.setItem("profile", data.data.profile);
          localStorage.setItem("token", data.Token);
          localStorage.setItem("userId", data.data._id);
          localStorage.setItem("status", data.data.status);
          toast.success("Login successful! Redirecting...", {
            autoClose: 1000,
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error(data.message || "Login failed!");
        }
        setUserData({ email: "", password: "" });
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Something went wrong!");
      });
  };

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  return (
    <>
      <section className="login">
        <div className="container-fluid">
          <div className="row overflow-hidden">
            <div className="col px-0">
              <div className="login_left">
                <div className="login_left_inner">
                  <Link to={"/"}>
                    <FaArrowLeftLong className="fs-3"/>
                  </Link>
                  <h5 className="text-center mb-4">Welcome Back!</h5>
                  <div>
                    <p className="mb-0">Email:</p>
                    <input
                      type="text"
                      name="email"
                      value={userData.email}
                      required
                      onChange={handleChange}
                    />
                    <p className="mb-0">Password:</p>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="user_input"
                        required
                        value={userData.password}
                        onChange={handleChange}
                      />
                      <span
                        className="password-icon"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn text-white login_btn mt-4"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? <div className="spinner"></div> : "Login"}
                  </button>
                  {/* <Link
                    to={"/sendotp"}
                    onClick={() => localStorage.setItem("isotp", true)}
                    className="text-decoration-none mt-2 fs-5 text-black fw-bold d-flex justify-content-center cursor-pointer"
                  >
                    Reset Password
                  </Link> */}
                  <p className="inter fw-medium text-center">
                    Don't have an account?{" "}
                    <Link
                      to={"/register"}
                      className="inter fw-bold text-dark text-decoration-none"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
