import React, { useEffect, useState } from "react";
import "../blogsingle/Blogsingle.css";
import { CiShare2 } from "react-icons/ci";
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import { useParams } from "react-router-dom";

const Adminpostsingle = () => {
  const [blog,setBlog] = useState({})

  const { blogId } = useParams()
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/view/blogs/post/${blogId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization:`Bearer ${localStorage.getItem("admintoken")}`
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
  
  return (
    <>
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
              <p className="me-4">
                <CiShare2 />
                1K shares
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

    </>
  );
};

export default Adminpostsingle;