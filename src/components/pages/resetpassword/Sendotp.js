import React, { useState } from "react";
import "../login/Login.css";
import computer from "../../images/login.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BaseUrl } from "../../Service/Url";

const Sendotp = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ email: "" });

  const handleClick = async () => {
    const response = await fetch(`${BaseUrl}/user/send-otp`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      toast.success("OTP Send successful!", {
        autoClose: 1000,
      });
      const userId = data.data.userId
      setTimeout(() => {
        // navigate("/enterotp", { replace: true });
        navigate(`/enterotp/${userId}`);
      }, 2000);
    } else {
      toast.error(data.message || "OTP Send failed!");
    }
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
            <div className="col-xl-9 col-lg-7 px-0 position-relative">
              <div className="login_left">
                <div className="login_left_inner">
                  <h5 className="text-center mb-4 fs-2">Reset Password</h5>
                  <div>
                    <p className="mb-0">Enter Your Email :</p>
                    <input
                      type="text"
                      name="email"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    className="btn text-white login_btn mt-4"
                    onClick={handleClick}
                  >
                    Send OTP
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

export default Sendotp;
