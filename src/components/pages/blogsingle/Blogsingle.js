import React, { useEffect, useState } from "react";
import "../blogsingle/Blogsingle.css";
import Header from "../../header/Header";
import { CiShare2 } from "react-icons/ci";
import Footer from "../../footer/Footer"
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import Blogcard from "../../card/Blogcard";
import { useParams } from "react-router-dom";
import { BaseUrl } from "../../Service/Url";

const Blogsingle = () => {
  const [post, setPost] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [blog,setBlog] = useState({})

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

  const { blogId } = useParams()
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${BaseUrl}/user/view/blogs/post/${blogId}`, {
          method: "GET",
          headers: {
            authorization:`Bearer ${localStorage.getItem("token")}`
          },
        });
        const data = await response.json()
        setBlog(data.data)
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }
    fetchBlogs();
  }, [blogId]);
  
  const handleToggle = () => {
    setShowAll(!showAll);
  };
  return (
    <>
      <Header bgcolor="black" btnwhite="white" />
      <section>
        <div className="container px-0">
          <div
            className="blogsingle_hero text-white p-sm-4 p-2 d-flex justify-content-sm-end justify-content-center flex-column"
            style={{ backgroundImage: `url(${blog.blogimg})` }}
          >
            <div className="blogsingle_hero_text">
            <h1 className="europa_bold text-uppercase">{blog.title}</h1>
            <p className="fs-sm-4 fs-5 europa_reg">{blog.maindescription}</p>
            <div className="d-flex flex-wrap">
              <p className="me-4">{blog.name}</p>
              <p className="me-4">
                {new Date(blog.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="abot_blog">
            <h2>Tincidunt veni tellus orci aenean consectetuer</h2>
            <p>{blog.adddescription1}</p>
            <div>
              <img
                src={blog.additionalimg}
                alt=""
                width={"100%"}
                height={"100%"}
              />
            </div>
            <p>
              Sociis consequat adipiscing sit curabitur donec sem luctus cras
              natoque vulputate dolor eget dapibus. Nec vitae eros ullamcorper
              laoreet dapibus mus ac ante viverra. A aenean sit augue curabitur
              et parturient nisi sed enim. Nulla nec quis sit quisque sem
              commodo ultricies neque. Lorem eget venenatis dui ante luctus
              ultricies tellus montes. Quis in sapien tempus.
            </p>
            <h2>Eu ridiculus fringilla</h2>
            <p>{blog.adddescription2}</p>
            <div className="blog_img">
              <div className="row justify-content-center">
                {blog?.additionalimg?.map((item) => (
                  <div className="col-6 col-md-4 mb-4">
                    <img src={item} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <p className="mb-0">
              Venenatis ante veni nullam ridiculus penatibus vidi eu
              consectetuer integer. Vulputate ipsum lorem nascetur rhoncus.
              Aliquam vitae elit blandit enim eget laoreet. Dapibus leo sociis
              quis nulla adipiscing amet integer sem ullamcorper in maecenas eu
              imperdiet.
            </p>
            <p className="mb-0">
              Ante blandit amet ultricies ut in nam massa rhoncus. Eget eu massa
              nisi quis viverra dapibus aliquam. Id ridiculus lorem ut amet dis
              orci tellus etiam aenean pellentesque.
            </p>
            <p>
              Maecenas tempus aenean nulla viverra neque vel nec cras justo
              sapien condimentum ut varius. Blandit sem etiam vel nullam
              vulputate sociis amet varius dolor. Vitae a ut. Etiam rhoncus ante
              sit. Nisi nullam donec dui eu phasellus a elementum elit faucibus
              nec. Eros eu pulvinar pede luctus sit aenean lorem.
            </p>
          </div>
        </div>
      </section>

      <section className="subscribe_main">
        <div className="container">
          <div className="subscribe text-white">
            <h2 className="mb-3">Sign Up for Our Newsletters</h2>
            <p>Get notified of the best deals on our WordPress themes.</p>
            <div className="position-relative subscribe_fild">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="form-control py-3 fs-4"
              />
              <button className="subscribe_btn position-absolute btn btn-light border fs-5 px-4 py-2">
                Subscribe
              </button>
            </div>
            <div className="d-flex align-items-center mt-3 gap-3">
              <input type="checkbox" />
              <p className="mb-0">
                By checking this box, you confirm that you have read and are
                agreeing to our terms of use regarding the storage of the data
                submitted through this form.
              </p>
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