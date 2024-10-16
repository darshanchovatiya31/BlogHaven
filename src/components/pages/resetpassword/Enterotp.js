import React, { useState, useEffect } from 'react';
import "../login/Login.css";
import computer from "../../images/login.png";
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { BaseUrl } from '../../Service/Url';

const Enterotp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [timer, setTimer] = useState(60); // Default 60 seconds
    const { userId } = useParams();

    useEffect(() => {
        // Load the timer value from localStorage when the component is mounted
        const savedTimer = localStorage.getItem("otp-timer");
        if (savedTimer) {
            setTimer(parseInt(savedTimer));
        }

        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => {
                    const newTime = prevTimer - 1;
                    localStorage.setItem("otp-timer", newTime); // Save timer value to localStorage
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(countdown);
        } else {
            // Timer expired, delete OTP and handle accordingly
            fetch(`${BaseUrl}/user/delete-otp/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    toast.warning("OTP expired. Redirecting to update password...", { autoClose: 2000 });
                    localStorage.removeItem("otp-timer"); // Clear timer from localStorage
                    setTimeout(() => {
                        navigate("/sendotp");
                    }, 2000);
                } else {
                    toast.error("Failed to handle OTP expiration.");
                }
            })
            .catch((err) => {
                toast.error("Something went wrong with OTP expiration.");
            });
        }
    }, [timer, navigate, userId]);

    const handleClick = async () => {
        const otpString = otp.join("");
        const response = await fetch(`${BaseUrl}/user/reset-otp`, {
            method: 'POST',
            body: JSON.stringify({ otp: otpString }),
            headers: {
                'Content-Type': 'application/json'
            }
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
        setOtp(new Array(4).fill("")); // Reset OTP input
    };

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only digits
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 3) {
                document.getElementById(`otp-${index + 1}`).focus(); // Move to next input
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus(); // Move to previous input
        }
    };

    return (
        <>
            <section className="login">
                <div className="container-fluid">
                    <div className="row overflow-hidden">
                        <div className="col-xl-9 col-lg-7 px-0 position-relative">
                            <div className="login_left">
                                <div className="login_left_inner">
                                    <h5 className="text-center mb-4 fs-2">Enter OTP</h5>
                                    <div className="otp-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                className='form-control user_input otp_input mb-2 mx-1'
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                required
                                                style={{
                                                    width: '50px',
                                                    textAlign: 'center',
                                                    fontSize: '24px',
                                                    margin: '0 5px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    padding: '10px',
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-center">Time remaining: {timer} seconds</p> {/* Countdown timer display */}
                                    <button className="btn text-white login_btn mt-4" onClick={handleClick}>Next</button>
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

export default Enterotp;
