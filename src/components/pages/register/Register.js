import React, { useState } from "react";
import "../register/Register.css";
import register from "../../images/register.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowcPassword] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    fname: "",
    username: "",
    email: "",
    password: "",
    Confirm_Password: "",
  });

  const [profileImage, setProfileImage] = useState(null); // New state to store the selected file

  const handleClick = () => {
    const formData = new FormData();
    formData.append("fname", userData.fname);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("Confirm_Password", userData.Confirm_Password);
    formData.append("profile", profileImage); // Append the file to the FormData

    fetch("http://localhost:5000/user/user-signup", {
      method: "POST",
      body: formData, // Use formData instead of JSON
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Registered successfully! Redirecting to login...", {
            position: "top-center",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(data.message || "Registration failed!", {
            position: "top-center",
            autoClose: 3000,
          });
        }
        setUserData({
          fname: "",
          username: "",
          email: "",
          password: "",
          Confirm_Password: "",
        });
        setProfileImage(null); // Reset the file input
      })
      .catch((err) => {
        toast.error(err.message || "Something went wrong!", {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event) => {
    setProfileImage(event.target.files[0]); // Store the selected file
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglecPasswordVisibility = () => {
    setShowcPassword(!showcPassword);
  };

  return (
    <>
      <section className="main_register">
        <div className="container">
          <div className="register">
            <div className="row">
              <div className="col-xl-6 col-lg-7 col-12 p-0 d-none d-lg-block">
                <div className="register_left">
                  <img src={register} alt="Register" />
                </div>
              </div>
              <div className="col-xl-6 col-lg-5 col-12 px-2 px-sm-0 d-flex align-items-center justify-content-center">
                <div className="register_right">
                  <h5 className="text-center mb-4">
                    Please Fill out form to Register!
                  </h5>
                  <div className="register_right_inner">
                    <p className="mb-0">Full name:</p>
                    <input
                      type="text"
                      name="fname"
                      required
                      onChange={handleChange}
                      value={userData.fname}
                    />
                    <p className="mb-0">Username:</p>
                    <input
                      type="text"
                      name="username"
                      required
                      onChange={handleChange}
                      value={userData.username}
                    />
                    <p className="mb-0">Email:</p>
                    <input
                      type="email"
                      name="email"
                      required
                      onChange={handleChange}
                      value={userData.email}
                    />
                    <p className="mb-0">Password:</p>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="user_input"
                        required
                        onChange={handleChange}
                        value={userData.password}
                      />
                      <span
                        className="password-icon"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <p className="mb-0">Confirm Password:</p>
                    <div className="password-input-container">
                      <input
                        type={showcPassword ? "text" : "password"}
                        name="Confirm_Password"
                        className="user_input"
                        required
                        onChange={handleChange}
                        value={userData.Confirm_Password}
                      />
                      <span
                        className="password-icon"
                        onClick={togglecPasswordVisibility}
                      >
                        {showcPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <p className="mb-0">Profile Picture:</p>
                    {/* New file input */}
                    <input
                      type="file"
                      name="profile"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    className="btn text-white register_btn mt-5"
                    onClick={handleClick}
                  >
                    Register
                  </button>
                  <p className="inter fw-medium text-center mt-4">
                    Yes, I have an account?{" "}
                    <Link
                      to={"/login"}
                      className="inter fw-bold text-dark text-decoration-none"
                    >
                      Login
                    </Link>
                  </p>
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

export default Register;
