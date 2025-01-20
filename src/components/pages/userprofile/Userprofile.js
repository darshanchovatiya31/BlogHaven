import React, { useEffect, useState } from "react";
import "../userprofile/Userprofile.css";
import { Link, useNavigate } from "react-router-dom";
import { BaseUrl } from "../../Service/Url";
import { toast } from "react-toastify";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const Userprofile = () => {
    const [profiledata , setprofiledata] = useState({})
    const token = localStorage.getItem("token");
    const Navigate = useNavigate();

    useEffect(() => {
      const fetchBlogs = async () => {
        try {
          const response = await fetch(
            `${BaseUrl}/user/profiledata`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data = await response.json();
          
          if (data && data.data) {
            setprofiledata(data.data);
          } else {
            console.error("Unexpected API response structure");
          }
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      };
  
      fetchBlogs();
    }, [token]);

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      localStorage.removeItem("userId");
      localStorage.removeItem("status");
      toast.success("Logout successful!", { autoClose: 1000 });
      Navigate("/login");
    };
  return (
    <>
      <section className="userprofile">
        <div className="profile_container">
        <div className="rov">
          <Link to={"/blog"}><h1><MdOutlineKeyboardBackspace /></h1></Link>
        </div>
          <div className="row mb-md-5">
            <div className="col-12">
              <div className="profile_img text-center">
                <img src={profiledata.profile} alt="Profile" className="user-image" />
                <h3 className="mt-3 profile_username text-uppercase">{profiledata.username}</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col mt-sm-5 mt-3 d-flex flex-column align-items-center">
              <div className="profile_details">
                <h3>Full Name :-</h3>
                <p>{profiledata.fname}</p>
              </div>
              <div className="profile_details">
                <h3>Username :-</h3>
                <p>{profiledata.username}</p>
              </div>
              <div className="profile_details">
                <h3>Email :-</h3>
                <p>{profiledata.email}</p>
              </div>
              <div className="justify-content-between d-flex w-100">
              <Link to={`/updateprofile/${profiledata._id}`} state={{user:profiledata}}>
              <button className="profile_edit">Edit Profile</button>
              </Link>
              <button onClick={handleLogout} className="profile_logout">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Userprofile;
