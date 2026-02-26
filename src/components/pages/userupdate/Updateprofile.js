import React, { useState } from "react";
import "../userupdate/UpdateProfile.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../../Service/Url";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const UpdateProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;
  const [profileData, setProfileData] = useState({
    fname: user.fname || "",
    username: user.username || "",
    email: user.email || "",
    profile: null,
  });
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

    const { fname, username, email, profile } = profileData;
    const userId = user._id;
    const token = localStorage.getItem("token");

    const updatedProfileData = new FormData();
    updatedProfileData.append("fname", fname);
    updatedProfileData.append("username", username);
    updatedProfileData.append("email", email);
    if (profile) {
      updatedProfileData.append("profile", profile);
    }

    try {
      const response = await fetch(`${BaseUrl}/user/update-profile/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updatedProfileData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully!", { autoClose: 1500 });
        setTimeout(() => {
          navigate("/userprofile");
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
      console.error(error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, profile: e.target.files[0] });
  };

  return (
    <>
      <section className="update_profile">
        <div className="container-fluid">
          <div className="row overflow-hidden">
            <div className="col px-0">
              <div className="update_profile_wrapper">
                <div className="update_profile_inner">
                  <Link to={"/userprofile"}>
                    <MdOutlineKeyboardBackspace className="back_arrow" />
                  </Link>
                  <h5 className="text-center mb-4">Update Your Profile</h5>
                  <div className="update_form">
                    <p className="mb-0">Full name:</p>
                    <input
                      type="text"
                      name="fname"
                      required
                      onChange={handleChange}
                      value={profileData.fname}
                    />
                    <p className="mb-0">Username:</p>
                    <input
                      type="text"
                      name="username"
                      required
                      onChange={handleChange}
                      value={profileData.username}
                    />
                    <p className="mb-0">Email:</p>
                    <input
                      type="email"
                      name="email"
                      required
                      onChange={handleChange}
                      value={profileData.email}
                    />
                    <p className="mb-0">Profile Picture:</p>
                    <input
                      type="file"
                      name="profile"
                      onChange={handleProfileChange}
                    />
                  </div>
                  <button
                    className={`btn text-white update_btn mt-4 ${
                      isLoading ? "loading" : ""
                    }`}
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
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

export default UpdateProfile;
