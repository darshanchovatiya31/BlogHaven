import React, { useState, useRef,useEffect } from "react"; // Import useRef
import "./CreateBlog.css";
import { Categary } from "../../data/Data";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { BaseUrl } from "../../Service/Url";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [blogData, setBlogData] = useState({
    name: "",
    title: "",
    category: "",
    maindescription: "",
    adddescription1: "",
    adddescription2: "",
  });
  const [blogImg, setBlogImg] = useState(null);
  const [additionalImg, setAdditionalImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const additionalImgRef = useRef();
  const blogImgRef = useRef();
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${BaseUrl}/user/update/blogsdata/${blogId}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setBlogData({
          name: data.data.name,
          title: data.data.title,
          category: data.data.category,
          maindescription: data.data.maindescription,
          adddescription1: data.data.adddescription1,
          adddescription2: data.data.adddescription2,
        });
        setBlogImg(data.data.blogimg);
        setAdditionalImg(data.data.additionalimg);
        
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, [blogId]);

  const handleClick = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("name", blogData.name);
    formData.append("title", blogData.title);
    formData.append("category", blogData.category);
    formData.append("maindescription", blogData.maindescription);
    formData.append("adddescription1", blogData.adddescription1);
    formData.append("adddescription2", blogData.adddescription2);

    if (blogImg) {
      formData.append("blogimg", blogImg);
    }

    if (additionalImg.length > 0) {
      additionalImg.forEach((img) => {
        formData.append("additionalimg", img);
      });
    }
    setLoading(true);

    try {
      let url, method;
      if (blogId) {
        // Updating blog
        url = `${BaseUrl}/blog/update/blogs/${blogId}`;
        method = "PUT";
      } else {
        // Creating new blog
        url = `${BaseUrl}/blog/blog-data/${userId}`;
        method = "POST";
      }

      const res = await fetch(url, {
        method: method,
        body: formData,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setLoading(false);
      if (data.success) {
        navigate("/blog");
        toast.success(
          blogId ? "Blog updated successfully!" : "Blog created successfully!",
          { autoClose: 1000 }
        );

        // Clear the form fields
        setBlogData({
          name: "",
          title: "",
          category: "",
          maindescription: "",
          adddescription1: "",
          adddescription2: "",
        });
        setBlogImg(null);
        setAdditionalImg([]);

        // Reset the file inputs
        if (blogImgRef.current) blogImgRef.current.value = "";
        if (additionalImgRef.current) additionalImgRef.current.value = "";
      } else {
        toast.error(data.message || "Failed to create blog!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "Something went wrong!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleBlogImgChange = (e) => {
    setBlogImg(e.target.files[0]);
  };

  const handleAdditionalImgChange = (e) => {
    setAdditionalImg(Array.from(e.target.files));
  };

  return (
    <section className="CreateBlog">
      <div className={`container mt-5 ${loading ? "blurred" : ""}`}>
        <Link to={"/blog"}>
          <FaArrowLeftLong className="text-black fs-1 mb-2 ms-2" />
        </Link>
        <div className="card p-4 shadow-sm mb-5">
          <h2 className="text-center mb-4">
            {blogId ? "Update Blog" : "Create A New Blog"}
          </h2>
          <form encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="main-image" className="form-label">
                Main Blog Image
              </label>
              <input
                type="file"
                name="blogimg"
                className="form-control"
                id="main-image"
                onChange={handleBlogImgChange}
                accept="image/*"
                ref={blogImgRef} 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="additional-images" className="form-label">
                Additional Blog Images
              </label>
              <input
                type="file"
                className="form-control"
                id="additional-images"
                name="additionalimg"
                onChange={handleAdditionalImgChange}
                accept="image/*"
                multiple
                ref={additionalImgRef} 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Your Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                onChange={handleChange}
                value={blogData.name}
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Blog Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                onChange={handleChange}
                value={blogData.title}
                placeholder="Enter blog title"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-select"
                id="category"
                name="category"
                onChange={handleChange}
                value={blogData.category}
              >
                <option value="">Select category</option>
                {Categary.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="main-description" className="form-label">
                Main Blog Description
              </label>
              <textarea
                className="form-control"
                id="main-description"
                rows="4"
                onChange={handleChange}
                value={blogData.maindescription}
                name="maindescription"
                placeholder="Enter main blog description"
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="description-1" className="form-label">
                Additional Section 1
              </label>
              <textarea
                className="form-control"
                id="description-1"
                rows="3"
                onChange={handleChange}
                value={blogData.adddescription1}
                name="adddescription1"
                placeholder="Enter additional content"
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="description-2" className="form-label">
                Additional Section 2
              </label>
              <textarea
                className="form-control"
                id="description-2"
                rows="3"
                onChange={handleChange}
                value={blogData.adddescription2}
                name="adddescription2"
                placeholder="Enter additional content"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              onClick={handleClick}
              disabled={loading}
            >
              {loading
                ? "Creating Blog..."
                : blogId
                ? "Update Blog"
                : "Create Blog"}
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="loader-overlay">
          <div className="modern-loader"></div>
        </div>
      )}
    </section>
  );
};

export default CreateBlog;