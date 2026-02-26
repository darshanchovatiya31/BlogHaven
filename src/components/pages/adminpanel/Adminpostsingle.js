import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import "../adminpanel/Adminpanel.css";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useParams } from "react-router-dom";
import { BaseUrl } from "../../Service/Url";

const Adminpostsingle = () => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const { blogId } = useParams();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BaseUrl}/admin/view/blogs/post/${blogId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        });
        const data = await response.json();
        setBlog(data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [blogId]);

  if (loading) {
    return (
      <div className="adminpanel">
        <div className="admin_head">
          <AdminHeader />
        </div>
        <section className="admin-post-single-section">
          <div className="admin-post-single-loading">
            <div className="loading-spinner"></div>
            <p>Loading post...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="adminpanel">
        <div className="admin_head">
          <AdminHeader />
        </div>
        <section className="admin-post-single-section">
          <div className="admin-post-single-container">
            <Link to="/adminposts" className="admin-post-back-btn">
              <MdArrowBack />
              <span>Back to Posts</span>
            </Link>

            <div className="admin-post-hero">
              <div
                className="admin-post-hero-image"
                style={{ backgroundImage: `url(${blog.blogimg})` }}
              >
                <div className="admin-post-hero-overlay">
                  <div className="admin-post-hero-content">
                    {blog.category && (
                      <span className="admin-post-category">{blog.category}</span>
                    )}
                    <h1 className="admin-post-hero-title">{blog.title}</h1>
                    <p className="admin-post-hero-description">{blog.maindescription}</p>
                    <div className="admin-post-hero-meta">
                      <span className="admin-post-author">
                        {blog.userId?.fname || blog.name}
                      </span>
                      <span className="admin-post-date">
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-post-content">
              <div className="admin-post-body">
                {blog.adddescription1 && (
                  <div className="admin-post-section">
                    <p className="admin-post-text">{blog.adddescription1}</p>
                  </div>
                )}

                {blog.additionalimg && (
                  <div className="admin-post-images">
                    {Array.isArray(blog.additionalimg) ? (
                      blog.additionalimg.length === 1 ? (
                        <div className="admin-post-image-single">
                          <img src={blog.additionalimg[0]} alt={blog.title} />
                        </div>
                      ) : (
                        <div className="admin-post-image-grid">
                          {blog.additionalimg.map((item, index) => (
                            <div key={index} className="admin-post-image-item">
                              <img src={item} alt={`${blog.title} - ${index + 1}`} />
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="admin-post-image-single">
                        <img src={blog.additionalimg} alt={blog.title} />
                      </div>
                    )}
                  </div>
                )}

                {blog.adddescription2 && (
                  <div className="admin-post-section">
                    <p className="admin-post-text">{blog.adddescription2}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Adminpostsingle;