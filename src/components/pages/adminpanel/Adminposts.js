import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import "../adminpanel/Adminpanel.css";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiShow } from "react-icons/bi";
import { BaseUrl } from "../../Service/Url";

const Adminposts = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [isSearching, setIsSearching] = useState(false); // State to manage search loading

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("admintoken");

  // Fetch all blogs initially
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${BaseUrl}/admin/blog/allblog`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        setBlogs(data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Fetch blogs based on the search query
  const searchBlogs = async (query) => {
    setIsSearching(true); // Set searching to true
    try {
      const response = await fetch(
        `${BaseUrl}/admin/category/searching?title=${query}&userId=${userId}`,
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
    setIsSearching(false);
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
      const response = await fetch(`${BaseUrl}/user/homeblogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

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
        `${BaseUrl}/admin/postdelete/${blogId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
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

  return (
    <>
      <div className="adminpanel">
        <div className="admin_head">
          <AdminHeader />
        </div>
        <section>
          <div className="adminsection">
            <h2 className="p-3 text-uppercase"> Posts</h2>
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
                        <h3>
                          {blog.title} (Published -{" "}
                          {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                          )
                        </h3>
                        <div className="d-flex admin_post_userdata">
                          <img src={blog.userId.profile} alt="" />
                          <h4 className="mb-0"> {blog.userId.fname}</h4>
                        </div>
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
                        <Link
                          to={`/admin/postsingle/${blog._id}`}
                          className="text-black"
                        >
                          <span>
                            <BiShow className="view" />
                          </span>
                        </Link>
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
      </div>
    </>
  );
};

export default Adminposts;
