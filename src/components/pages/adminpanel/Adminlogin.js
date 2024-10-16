import React, { useState } from "react";
import "../login/Login.css";
import computer from "../../images/login.png";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Adminlogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
  
    const [userData, setUserData] = useState({
      email: "",
      password: "",
    });
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const handleClick = () => {
      fetch("http://localhost:5000/admin/login", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          
          if (data.success) {
            localStorage.setItem("admintoken", data.Token);
            toast.success("Login successful! Redirecting...", {
              autoClose: 1000,
            });
            setTimeout(() => {
              navigate("/adminpanal"); // Redirect to home after 2 seconds
            }, 2000);
          } else {
            toast.error(data.message || "Login failed!");
          }
          setUserData({ email: "", password: "" });
        })
        .catch((err) => {
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
              <div className="col-xl-9 col-lg-7 px-0 position-relative">
                <div className="login_left">
                  <div className="login_left_inner">
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
                    >
                      Login
                    </button>
                  </div>
                  <div className="login_sidedesign">
                    <div></div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-5 px-0 d-none d-lg-block">
                <div className="login_right position-relative">
                  <div className="login_right_img position-absolute">
                    <img src={computer} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ToastContainer />
      </>
    );
  };
export default Adminlogin
