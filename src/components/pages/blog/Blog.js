import React, { useEffect, useState } from "react";
import "../blog/Blog.css";
import mainlogo from "../../images/mainlogo.png";
import { FaEdit, FaSearch } from "react-icons/fa";
import { IoShareSocial } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../../Service/Url";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [isSearching, setIsSearching] = useState(false); // State to manage search loading
  const [profiledata, setprofiledata] = useState({});

  const Navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch all blogs initially
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${BaseUrl}/user/userpost/${userId}`,
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
          setBlogs(data.data); // Adjust this line based on actual response structure
        } else {
          console.error("Unexpected API response structure");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [userId, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    localStorage.removeItem("userId");
    localStorage.removeItem("status");
    toast.success("Logout successful!", { autoClose: 1000 });
    Navigate("/login");
  };

  // Fetch blogs based on the search query
  const searchBlogs = async (query) => {
    setIsSearching(true); // Set searching to true
    try {
      const response = await fetch(
        `${BaseUrl}/user/category/search?title=${query}&userId=${userId}`,
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
        setBlogs(data.data);
      } else {
        console.error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Error searching blogs:", error);
    }
    setIsSearching(false); // Set searching to false after the request is done
  };

  // Handle input change and trigger API call
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update search query state
    if (query) {
      searchBlogs(query); // Call API when input changes
    } else {
      // If the input is empty, fetch all blogs for the user
      fetchAllBlogs();
    }
  };

  // Fetch all blogs for the user
  const fetchAllBlogs = async () => {
    setIsSearching(true); // Set searching to true
    try {
      const response = await fetch(
        `${BaseUrl}/user/userpost/${userId}`,
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
        setBlogs(data.data);
      } else {
        console.error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Error fetching all blogs:", error);
    }
    setIsSearching(false); // Set searching to false after the request is done
  };

  const handledeleteclick = async (blogId, e) => {
    e.stopPropagation();
    setLoading(true);
    setLoadingId(blogId);
    try {
      const response = await fetch(
        `${BaseUrl}/user/postdelete/${blogId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      } else {
        console.log("Failed to delete blog");
      }
    } catch (error) {
      console.log("Delete blog error", error);
    } finally {
      setLoading(false); // Hide loader after delete completes
      setLoadingId(null);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${BaseUrl}/user/profiledata`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

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

  return (
    <>
      <section className="blog_header">
        <div className="container-fluid">
          <div className="blog_head d-flex justify-content-between align-items-center py-2">
            <div className="head_logo">
              <Link to={"/"}>
                <img src={mainlogo} alt="Main Logo" />
              </Link>
            </div>

            <div className="head_addpost d-flex align-items-center gap-2">
              <Link to={"/userprofile"}>
                <div>
                  <img src={profiledata.profile} alt="User Profile" />
                </div>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="blog_hero">
            <div className="head_search mx-auto mt-3">
              <input
                type="text"
                placeholder="Search Posts"
                value={searchQuery}
                onChange={handleSearchChange} // Call the search handler on change
              />
              <FaSearch className="icon" />
            </div>
            <div className="blog_hero_top d-flex justify-content-between">
              <h3>ALL ({blogs?.length})</h3>
              <div className="head_addpost d-flex align-items-center gap-2">
                <Link to={"/createblog"}>
                  <button>+ NEW POST</button>
                </Link>
              </div>
            </div>
            {isSearching ? (
              <p className="text-center fs-3">Searching...</p>
            ) : blogs?.length > 0 ? (
              blogs?.map((blog) => (
                <div
                  key={blog._id}
                  className="blog_hero_bottum d-sm-flex justify-content-between p-md-4 p-2 mb-4"
                >
                  <div className="blog_hero_detail d-flex align-items-center gap-3">
                    <div className="blog_hero_img">
                      <img src={blog.blogimg} alt={blog.title} />
                    </div>
                    <div className="blog_hero_text">
                      <h3>{blog.title}</h3>
                      <h4>
                        Published -{" "}
                        {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                      </h4>
                    </div>
                  </div>
                  <div className="blog_hero_crud d-flex align-items-center gap-md-3 gap-2 mt-3 mt-sm-0 justify-content-end">
                    <i>
                      {loading && loadingId === blog._id ? (
                        <div className="loader"></div> // Show loader
                      ) : (
                        <span onClick={(e) => handledeleteclick(blog._id, e)}>
                          <MdDelete className="delete" />
                        </span>
                      )}
                    </i>
                    <i>
                      <FaEdit
                        className="edit"
                        onClick={() => Navigate(`/editblog/${blog._id}`)}
                      />
                    </i>
                    <i>
                      <IoShareSocial className="share" />
                    </i>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center fs-3">No Blogs Found</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
