import React, { useState } from "react";
import "../login/Login.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../../Service/Url";

const Sendotp = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BaseUrl}/user/send-otp`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success("OTP Sent successfully!", { autoClose: 1000 });
        const userId = data.data.userId;
        setTimeout(() => {
          navigate(`/enterotp/${userId}`);
        }, 2000);
      } else {
        toast.error(data.message || "OTP Send failed!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }

    setIsLoading(false);
    setUserData({ email: "" });
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
                <div className="login_left_inner py-5">
                  <h5 className="text-center mb-4 fs-2">Reset Password</h5>
                  <div>
                    <p className="mb-0">Enter Your Email:</p>
                    <input
                      type="text"
                      name="email"
                      onChange={handleChange}
                      value={userData.email}
                      required
                    />
                  </div>
                  <button
                    className="btn text-white login_btn mt-4"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? <div className="spinner"></div> : "Send OTP"}
                  </button>
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

export default Sendotp;
