import React from 'react'
import "../footer/Footer.css"
import { FaFacebook, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer europa_reg d-flex justify-content-between align-items-center flex-wrap gap-4">
            <div className="footer_left mx-auto mx-md-0">
              <p className="mb-0 text-white">
                Designed & Developed by{" "}
                <span className="fw-bold">Darshan Chovatiya</span>
              </p>
            </div>
            <div className="footer_right mx-auto mx-md-0">
              <div className="row">
                <div className="col">
                  <FaFacebook className="mx-auto d-flex" />
                  <p className="mb-0">29</p>
                </div>
                <div className="col">
                  <FaTwitter className="mx-auto d-flex" />
                  <p className="mb-0">70K</p>
                </div>
                <div className="col">
                  <FaInstagram className="mx-auto d-flex" />
                  <p className="mb-0">40</p>
                </div>
                <div className="col">
                  <FaPinterest className="mx-auto d-flex" />
                  <p className="mb-0">13K</p>
                </div>
                <div className="col">
                  <FaYoutube className="mx-auto d-flex" />
                  <p className="mb-0">168K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer
