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
      <header className="admin-sidebar">
        <div className="admin_logo">
          <img src={Logo} alt="Blog Haven Logo" />
        </div>
        <div className="main">
          <nav className="admin-nav">
            <ul className="admin-nav-list">
              <li>
                <Link
                  to="/adminpanal"
                  className={`admin-nav-link ${
                    location.pathname === "/adminpanal" ? "active" : ""
                  }`}
                >
                  <IoHomeSharp className="admin-nav-icon" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/adminusers"
                  className={`admin-nav-link ${
                    location.pathname === "/adminusers" ? "active" : ""
                  }`}
                >
                  <FaUserAlt className="admin-nav-icon" />
                  <span>Users</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/adminposts"
                  className={`admin-nav-link ${
                    location.pathname === "/adminposts" ? "active" : ""
                  }`}
                >
                  <BsFillPostcardFill className="admin-nav-icon" />
                  <span>Posts</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/adminadvertisement"
                  className={`admin-nav-link ${
                    location.pathname === "/adminadvertisement" ? "active" : ""
                  }`}
                >
                  <RiAdvertisementFill className="admin-nav-icon" />
                  <span>Advertisement</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admincategories"
                  className={`admin-nav-link ${
                    location.pathname === "/admincategories" ? "active" : ""
                  }`}
                >
                  <BsFillPostcardFill className="admin-nav-icon" />
                  <span>Categories</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="setting_logout">
            <div
              className="admin-nav-link admin-logout-link"
              onClick={handleLogout}
            >
              <MdLogout className="admin-nav-icon" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
