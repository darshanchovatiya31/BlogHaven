import React from "react";
import Logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { BsFillPostcardFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import "../adminpanel/Adminpanel.css";
import { toast } from "react-toastify";

const AdminHeader = () => {
  const Navigate = useNavigate();

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
            <li className="my-4">
              <Link
                to={"/adminpanal"}
                className="text-white text-decoration-none fs-5"
              >
                <IoHomeSharp className="me-2" /> Dashboard
              </Link>
            </li>
            <li className="my-4">
              <Link
                to={"/adminusers"}
                className="text-white text-decoration-none fs-5"
              >
                <FaUserAlt className="me-2" /> Users
              </Link>
            </li>
            <li className="my-4">
              <Link
                to={"/adminposts"}
                className="text-white text-decoration-none fs-5"
              >
                <BsFillPostcardFill className="me-2" /> Posts
              </Link>
            </li>
          </ul>
        </nav>
        <div className="setting_logout">
          <ul>
            <li className="my-4">
              <Link
                to={"/adminsettings"}
                className="text-white text-decoration-none fs-5"
              >
                <FiSettings className="me-2" /> Settings
              </Link>
            </li>
            <li className="my-4">
              <p
                to={"/logout"}
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
