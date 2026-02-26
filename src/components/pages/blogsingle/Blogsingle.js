import React, { useEffect, useState } from "react";
import "../blogsingle/Blogsingle.css";
import Header from "../../header/Header";
import { CiShare2 } from "react-icons/ci";
import Footer from "../../footer/Footer";
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import Blogcard from "../../card/Blogcard";
import { useParams, Link } from "react-router-dom";
import { BaseUrl } from "../../Service/Url";

const Blogsingle = () => {
  const [post, setPost] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [blog, setBlog] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${BaseUrl}/user/homeblogs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setPost(data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const { blogId } = useParams();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${BaseUrl}/user/view/blogs/post/${blogId}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setBlog(data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, [blogId]);

  const handleToggle = () => {
    setShowAll(!showAll);
  };
  return (
    <>
      <Header bgcolor="black" btnwhite="white" />
      <section className="blogsingle_hero_section">
        <div
          className="blogsingle_hero text-white"
          style={{ backgroundImage: `url(${blog.blogimg})` }}
        >
          <div className="blogsingle_hero_text">
            <h1 className="europa_bold text-uppercase">{blog.title}</h1>
            <p className="europa_reg">{blog.maindescription}</p>
            <div className="d-flex flex-wrap">
              <p className="me-4">{blog.name}</p>
              <p className="me-4">
                {new Date(blog.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="abot_blog">
            <div className="blog-category-badge mb-4">
              {blog.category && (
                <span className="category-badge">{blog.category}</span>
              )}
            </div>
            <h2 className="europa_bold">{blog.title}</h2>
            <p className="blog-meta-info europa_reg">
              <span>{blog.name}</span> • <span>
                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </p>
            <p className="europa_reg">{blog.adddescription1}</p>
            {blog.additionalimg && blog.additionalimg.length > 0 && (
              <div className="blog_img">
                {blog.additionalimg.length === 1 ? (
                  <img
                    src={blog.additionalimg[0]}
                    alt={blog.title}
                  />
                ) : (
                  <div className="row justify-content-center">
                    {blog.additionalimg.map((item, index) => (
                      <div className="col-6 col-md-4 mb-4" key={index}>
                        <img src={item} alt={`${blog.title} - Image ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <p className="europa_reg">{blog.adddescription2}</p>
          </div>
        </div>
      </section>

      <section className="subscribe_main">
        <div className="container">
          <div className="subscribe text-white">
            <h2 className="mb-3">Join Our Creative Community</h2>
            <p>Discover inspiring stories, share your thoughts, and connect with like-minded creators from around the world.</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
              <Link to="/blog" className="community-btn community-btn-primary">
                Explore All Blogs
              </Link>
              <Link to="/createblog" className="community-btn community-btn-secondary">
                Start Writing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="blogs my-5">
            <div className="row justify-content-center">
              {post.slice(0, showAll ? post.length : 3).map((item, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <Blogcard Blogs={item} />
                </div>
              ))}
            </div>
            {post.length > 3 && (
              <button
                className="load-btn europa_bold bg-white"
                onClick={handleToggle}
              >
                {showAll ? "Show Less" : "Load More"}
              </button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blogsingle;
