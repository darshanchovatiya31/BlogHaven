import React, { useState } from 'react';
import "../login/Login.css";
import computer from "../../images/login.png";
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BaseUrl } from '../../Service/Url';

const Updatepassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showcPassword, setShowcPassword] = useState(false);
    const [userData, setUserData] = useState({ password: "" });
    const { userId } = useParams();

    const handleClick = async () => {
        // Update password API call
        const response = await fetch(`${BaseUrl}/user/update-password/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data.success) {
            toast.success("Password Updated successfully!", {
                autoClose: 1000,
            });

            // Call the delete OTP API after successful password update
            const otpResponse = await fetch(`${BaseUrl}/user/delete-otp/${userId}`, {
                method: 'DELETE', // Assuming DELETE is the method to remove the OTP
                headers: {
                    'Content-Type': 'application/json'
                }
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
                        <div className="col-xl-9 col-lg-7 px-0 position-relative">
                            <div className="login_left">
                                <div className="login_left_inner">
                                    <h5 className="text-center mb-4 fs-2"> Update Password</h5>
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
                                            <span className="password-icon" onClick={togglePasswordVisibility}>
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
                                            <span className="password-icon" onClick={togglecPasswordVisibility}>
                                                {showcPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="btn text-white login_btn mt-4" onClick={handleClick}>Update Password</button>
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
        </>
    )
}

export default Updatepassword;
