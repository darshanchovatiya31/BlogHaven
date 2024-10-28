import React from "react";
import Logo from "../../images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { BsFillPostcardFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RiAdvertisementFill } from "react-icons/ri";
import { toast } from "react-toastify";
import "../adminpanel/Adminpanel.css";

const AdminHeader = () => {
  const Navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    toast.success("Logout successful!", { autoClose: 1000 });
    Navigate("/admin/login");
  };

  return (
    <>
      <header>
        <div className="admin_logo">
          <img src={Logo} alt="" className="" />
        </div>
        <div className="main">
          <nav>
            <ul className="mt-5">
              <li
                className={`my-4  ${
                  location.pathname === "/adminpanal" ? "active-link" : ""
                }`}
              >
                <Link
                  to="/adminpanal"
                  className={`text-white text-decoration-none fs-5`}
                >
                  <IoHomeSharp className="me-2" /> Dashboard
                </Link>
              </li>
              <li
                className={`my-4 ${
                  location.pathname === "/adminusers" ? "active-link" : ""
                }`}
              >
                <Link
                  to="/adminusers"
                  className={`text-white text-decoration-none fs-5`}
                >
                  <FaUserAlt className="me-2" /> Users
                </Link>
              </li>
              <li
                className={`my-4  ${
                  location.pathname === "/adminposts" ? "active-link" : ""
                }`}
              >
                <Link
                  to="/adminposts"
                  className={`text-white text-decoration-none fs-5 `}
                >
                  <BsFillPostcardFill className="me-2" /> Posts
                </Link>
              </li>
              <li
                className={`my-4  ${
                  location.pathname === "/adminadvertisement"
                    ? "active-link"
                    : ""
                }`}
              >
                <Link
                  to="/adminadvertisement"
                  className={`text-white text-decoration-none fs-5 `}
                >
                  <RiAdvertisementFill className="me-2" /> Advertisement
                </Link>
              </li>
            </ul>
          </nav>
          <div className="setting_logout">
            <ul>
              <li className="my-4">
                <p
                  className="text-white text-decoration-none fs-5"
                  onClick={handleLogout}
                >
                  <MdLogout className="me-2" /> Logout
                </p>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
