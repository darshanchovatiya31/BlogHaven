import React, { useState, useEffect } from "react";
import "../login/Login.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../../Service/Url";

const Enterotp = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  useEffect(() => {
    const savedTimer = localStorage.getItem("otp-timer");
    if (savedTimer) {
      setTimer(parseInt(savedTimer));
    }

    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          const newTime = prevTimer - 1;
          localStorage.setItem("otp-timer", newTime);
          return newTime;
        });
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      fetch(`${BaseUrl}/user/delete-otp/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.warning("OTP expired. Redirecting...", { autoClose: 2000 });
            localStorage.removeItem("otp-timer");
            setTimeout(() => {
              navigate("/sendotp");
            }, 2000);
          } else {
            toast.error("Failed to handle OTP expiration.");
          }
        })
        .catch(() => {
          toast.error("Something went wrong with OTP expiration.");
        });
    }
  }, [timer, navigate, userId]);

  const handleClick = async () => {
    setIsLoading(true);
    const otpString = otp.join("");

    try {
      const response = await fetch(`${BaseUrl}/user/reset-otp`, {
        method: "POST",
        body: JSON.stringify({ otp: otpString }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        const userIdpass = data.data.userId;
        toast.success("OTP successful! Redirecting...", { autoClose: 1000 });
        setTimeout(() => {
          navigate(`/updatepassword/${userIdpass}`);
        }, 2000);
      } else {
        toast.error(data.message || "Wrong OTP!");
      }
    } catch (error) {
      toast.error("Something went wrong with OTP verification.");
    }

    setIsLoading(false);
    setOtp(new Array(4).fill("")); // Reset OTP input
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <>
      <section className="login">
        <div className="container-fluid">
          <div className="row overflow-hidden">
            <div className="col px-0">
              <div className="login_left">
                <div className="login_left_inner">
                  <h5 className="text-center mb-4 fs-2">Enter OTP</h5>
                  <div
                    className="otp-container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        className="form-control user_input otp_input mb-2 mx-1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        required
                        style={{
                          width: "50px",
                          textAlign: "center",
                          fontSize: "24px",
                          margin: "0 5px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "10px",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-center">Time remaining: {timer} seconds</p>
                  <button
                    className="btn text-white login_btn mt-4"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? <div className="spinner"></div> : "Next"}
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

export default Enterotp;
