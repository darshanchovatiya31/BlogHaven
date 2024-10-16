import React from "react";
import "../header/Header.css";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Categary } from "../data/Data.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = ({ bgcolor, btnwhite }) => {
  const navigate = useNavigate();

  const userStatus = localStorage.getItem("status");
  const HeandleClick = () => {
    if (userStatus === "pending") {
      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      localStorage.removeItem("userId");
      localStorage.removeItem("status");
      toast.error(
        "Your status is pending. You cannot create a Blog yet.login after 24 hour",
        { autoClose: 4000 }
      );
      navigate("/");
    } else if (userStatus === "block") {
      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      localStorage.removeItem("userId");
      localStorage.removeItem("status");
      toast.error("Your Block by Admin. You cannot create a Blog Post", {
        autoClose: 4000,
      });
      navigate("/");
    } else {
      navigate("/blog");
    }
  };

  return (
    <>
      <header>
        <nav
          className="navbar navbar-expand-lg"
          style={{ backgroundColor: bgcolor }}
        >
          <div className="container-lg container-fluid">
            <Link to={"/"} className="navbar-brand">
              <img src={logo} className="mainlogo" alt="Logo" />
            </Link>
            <button
              className="navbar-toggler bg-white btn menu-btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-text inter fw-bold text-black">
                Menu
              </span>
            </button>
            <div
              className="offcanvas offcanvas-start bg-black"
              tabIndex="-1"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                  <img src={logo} className="mainlogo" alt="Logo" />
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0 menu-border">
                  {Categary.map((item, index) => (
                    <li className="nav-item" key={index}>
                      <Link
                        className="nav-link text-white Europa_Bold menu mb-2 mb-md-0"
                        aria-current="page"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div class="d-flex align-items-center gap-xl-4 gap-2 create_blog_main_btn">
                  <>
                    <button
                      className="btn  SegoeUI blog-btn fs-6 rounded-0"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                      onClick={HeandleClick}
                      style={{ backgroundColor: btnwhite, color: bgcolor }}
                    >
                      CREATE A BLOG
                    </button>
                  </>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <ToastContainer />
    </>
  );
};

export default Header;
