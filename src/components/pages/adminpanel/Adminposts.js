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
        const response = await fetch(`${BaseUrl}/admin/blog/allblog`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
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
      const response = await fetch(`${BaseUrl}/admin/postdelete/${blogId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });
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
        <section className="admin-posts-section">
          <div className="adminsection">
            <div className="admin-posts-header">
              <h1 className="admin-posts-title">Posts</h1>
              <p className="admin-posts-subtitle">Manage all blog posts published on the platform</p>
            </div>
            <div className="admin-posts-content">
              <div className="admin-posts-search">
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search posts by title..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>
              </div>
              <div className="admin-posts-stats">
                <div className="posts-count">
                  <span className="posts-count-label">Total Posts</span>
                  <span className="posts-count-value">{blogs?.length || 0}</span>
                </div>
              </div>
              {isSearching ? (
                <div className="admin-posts-loading">
                  <div className="loading-spinner"></div>
                  <p>Searching posts...</p>
                </div>
              ) : blogs?.length > 0 ? (
                <div className="admin-posts-list">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="admin-post-card">
                      <div className="admin-post-info">
                        <div className="admin-post-image">
                          <img src={blog.blogimg} alt={blog.title} />
                          {blog.category && (
                            <span className="post-category-badge">{blog.category}</span>
                          )}
                        </div>
                        <div className="admin-post-details">
                          <h3 className="admin-post-title">{blog.title}</h3>
                          <div className="admin-post-meta">
                            <div className="admin-post-author">
                              <img src={blog.userId?.profile} alt={blog.userId?.fname} />
                              <span>{blog.userId?.fname}</span>
                            </div>
                            <span className="admin-post-date">
                              Published: {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="admin-post-actions">
                        <Link
                          to={`/admin/postsingle/${blog._id}`}
                          className="admin-view-btn"
                        >
                          <BiShow />
                          <span>View</span>
                        </Link>
                        <button
                          className="admin-delete-btn"
                          onClick={(e) => handledeleteclick(blog._id, e)}
                          disabled={loading && loadingId === blog._id}
                        >
                          {loading && loadingId === blog._id ? (
                            <div className="action-spinner"></div>
                          ) : (
                            <MdDelete />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-posts-empty">
                  <p>No posts found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Adminposts;
