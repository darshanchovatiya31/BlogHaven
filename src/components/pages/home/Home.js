import React, { useEffect, useState } from "react";
import "../home/Home.css";
import Header from "../../header/Header";
import { Destinations } from "../../data/Data";
import Blogcard from "../../card/Blogcard";
import Footer from "../../footer/Footer";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BaseUrl } from "../../Service/Url";

const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  speed: 1500,
  autoplaySpeed: 1000,
  cssEase: "linear",
  arrows: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const advertisement = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: 1000,
  autoplay: true,
  arrows: false,
  adaptiveHeight: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const Home = () => {
  const [post, setPost] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [adds, setadds] = useState();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const token = localStorage.getItem("token");

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
        console.log(data);
        setPost(data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(""); // Default category
  const [categoryData, setCategoryData] = useState([]);
  const [categoryDataLoading, setCategoryDataLoading] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch(`${BaseUrl}/user/categories?activeOnly=true`);
        const data = await response.json();

        if (response.ok && data.success) {
          const activeCategories = data.data || [];
          setCategories(activeCategories);
          // Set first category as default if available
          if (activeCategories.length > 0 && !selectedCategory) {
            setSelectedCategory(activeCategories[0].name);
          }
        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to fetch blogs based on the selected category
  const fetchCategoryBlogs = async (category) => {
    if (!category) return;
    
    setCategoryDataLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/user/category/blog`);
      const data = await response.json();

      if (response.ok && data.success) {
        // Update categoryData based on the selected category
        setCategoryData(data.data[category] || []);
      } else {
        console.error("Error fetching blogs:", data.message);
        setCategoryData([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setCategoryData([]);
    } finally {
      setCategoryDataLoading(false);
    }
  };

  // Effect to fetch blogs when a new category is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryBlogs(selectedCategory);
    }
  }, [selectedCategory]);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await fetch(`${BaseUrl}/user/status/active`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setadds(data.data);
        } else {
          console.error("Failed to fetch advertisements");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAdvertisements();
  }, [token]);
  return (
    <>
      <section>
        <div className="mainhero position-relative">
          <div className="header position-absolute">
            <Header />
          </div>
          <div className="hero">
            <div className="container">
              <div className="text-center">
                <h1 className="europa_bold">
                  INSPIRATION BY REAL PEOPLE: SIMPLE IDEAS, BIG IMPACT
                </h1>
                <p className="europa_reg">
                  Create Smart, Live Simply
                </p>
                <Link to={"/blog"}>
                  <button className="btn europa_bold">
                    Start Creating your Blog
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="blogs my-5">
            <div className="row justify-content-center">
              {post.slice(0, showAll ? post.length : 6).map((item, index) => (
                <div className="col-xl-4 col-md-6" key={index}>
                  <Blogcard Blogs={item} />
                </div>
              ))}
            </div>
            {post.length > 6 && (
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

      <section className="travel_main">
        <div className="container-fluid">
          <div className="travel">
            <div className="text-center container">
              <span className="europa_bold">Blogs</span>
              <h2 className="europa_bold mb-2 mt-2">
                Ricird Norton Photorealistic rendering as real photos
              </h2>
              <p className="europa_reg mb-3">
                Progressively incentivize cooperative systems through
                technically sound functionalities. The credibly productivate
                seamless data.
              </p>
              <Link to={"/blog"}>
                <button className="europa_bold plannig_btn">
                  Start creating your blog
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="advertisement-section">
        <div className="container">
          <Slider {...advertisement} className="advertisement-slider mb-3">
            {adds?.map((ads) => (
              <div className="slide">
                <img
                  className="advertisement-image"
                  src={ads.poster}
                  alt="Advertisement"
                />
              </div>
            ))}
          </Slider>
          <div className="text-center">
            <Link className="btn btn-primary btn-lg" to={"/advertisement"}>
              Advertise Now
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="destinations europa_bold">
            <h2>Top Destinations</h2>
            <p>
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022
            </p>
            <div className="row justify-content-between">
              <Slider {...settings}>
                {Destinations.map((item) => (
                  <div className=" px-2 col-sm-6 mb-4 mb-xl-0 d-flex justify-content-center">
                    <div
                      className="destinations_inner"
                      style={{ backgroundImage: "url(" + item.img + ")" }}
                    >
                      <h2 className="">{item.text}</h2>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="category">
            {/* Category Buttons */}
            {categoriesLoading ? (
              <div className="text-center mb-4">
                <p>Loading categories...</p>
              </div>
            ) : categories.length > 0 ? (
              <>
                <div className="d-lg-flex d-none gap-xl-5 gap-lg-4 flex-wrap justify-content-center category_name mb-4">
                  {categories.map((category) => (
                    <p
                      key={category._id}
                      className={`mb-2 fw-bold fs-5 ${
                        selectedCategory === category.name ? "activecategory" : ""
                      }`}
                      onClick={() => setSelectedCategory(category.name)}
                      style={{ cursor: "pointer" }}
                    >
                      {category.name}
                    </p>
                  ))}
                </div>

                <div className="d-flex gap-xl-5 gap-lg-4 flex-wrap justify-content-center mb-3 category_name d-lg-none">
                  <h2>Select Category</h2>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="text-center mb-4">
                <p>No categories available</p>
              </div>
            )}

            {/* Blog Posts */}
            {categoryDataLoading ? (
              <div className="text-center mt-5">
                <p>Loading category blogs...</p>
              </div>
            ) : categoryData.length > 0 ? (
              <div className="row justify-content-between gap-3 gap-lg-0">
                <div className="col-lg-6">
                  <div className="category_left border p-3">
                    <div className="category_left_img">
                      <img src={categoryData[0].blogimg} alt="" />
                    </div>
                    <p className="mt-4 europa_reg">
                      {new Date(categoryData[0].createdAt).toLocaleDateString(
                        "en-IN"
                      )}
                    </p>
                    <h4 className="europa_bold">{categoryData[0].title}</h4>
                    <p className="mt-3 europa_reg">
                      {categoryData[0].maindescription}
                    </p>
                    <Link
                      to={`/blogsingle/${categoryData[0]._id}`}
                      className="text-decoration-none europa_bold text-black border-bottom border-black pb-2"
                    >
                      View Post
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6 col-12">
                  {categoryData.length > 1 ? (
                    <div className="category_right border">
                      {categoryData.slice(1, 5).map((item) => (
                        <Link
                          to={`/blogsingle/${item._id}`}
                          className="text-decoration-none text-black"
                          key={item._id}
                        >
                          <div
                            className="row py-3 mx-2 border-bottom align-items-center"
                            key={item._id}
                          >
                            <div className="col-sm-5 ps-2 ps-lg-0 ps-xl-2 ">
                              <img
                                src={item.blogimg}
                                alt=""
                                width="100%"
                                className="category_side_img"
                              />
                            </div>
                            <div className="col-sm-7 px-0 category_right_inner">
                              <h4 className="europa_bold">{item.title}</h4>
                              <p className="europa_reg mb-0">
                                {new Date(item.createdAt).toLocaleDateString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center mt-5 notfound">
                      No selected category data found
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center mt-5 notfound">
                No selected category data found
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
