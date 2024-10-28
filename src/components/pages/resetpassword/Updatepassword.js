import React, { useState } from "react";
import "../login/Login.css";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { BaseUrl } from "../../Service/Url";

const Updatepassword = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowcPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({ password: "" });

  const handleClick = async () => {
    setIsLoading(true);
    const response = await fetch(`${BaseUrl}/user/update-password/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      toast.success("Password Updated successfully!", { autoClose: 1000 });

      const otpResponse = await fetch(`${BaseUrl}/user/delete-otp/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const otpData = await otpResponse.json();
      if (otpData.success) {
        console.log("OTP deleted successfully.");
      } else {
        toast.error(otpData.message || "Failed to delete OTP!");
      }

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      toast.error(data.message || "Password Update failed!");
    }
    setIsLoading(false);
    setUserData({ password: "" });
  };

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglecPasswordVisibility = () => {
    setShowcPassword(!showcPassword);
  };

  return (
    <>
      <section className="login">
        <div className="container-fluid">
          <div className="row overflow-hidden">
            <div className="col px-0">
              <div className="login_left">
                <div className="login_left_inner">
                  <h5 className="text-center mb-4 fs-2">Update Password</h5>
                  <div>
                    <p className="mb-0">New Password:</p>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="user_input"
                        onChange={handleChange}
                        required
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
                        onChange={handleChange}
                        required
                      />
                      <span
                        className="password-icon"
                        onClick={togglecPasswordVisibility}
                      >
                        {showcPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn text-white login_btn mt-4"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="spinner"></div>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Updatepassword;
