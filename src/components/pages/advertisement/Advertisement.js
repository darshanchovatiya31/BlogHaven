import React, { useEffect, useState } from "react";
import "../advertisement/Advertisement.css";
import mainlogo from "../../images/mainlogo.png";
import { load } from "@cashfreepayments/cashfree-js";
import { Link, useNavigate } from "react-router-dom";
import { BaseUrl } from "../../Service/Url";

const Advertisement = () => {
  const [ads, setads] = useState([]);
  const [price, setPrice] = useState(999);
  const [profiledata, setProfileData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("active");
  const [cashfree, setCashfree] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const Navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  let orderId = "";

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const cfInstance = await load({
          mode: "sandbox", // Set the mode ('sandbox' or 'production')
        });
        setCashfree(cfInstance);
      } catch (error) {
        console.error("Failed to load Cashfree SDK", error);
      }
    };

    initializeSDK();
  }, []);

  const getSessionId = async (adId) => {
    try {
      const res = await fetch(`${BaseUrl}/user/payment/${adId}`);
      if (res.ok) {
        const data = await res.json();
        orderId = data.data.order_id;
        return data.data.payment_session_id;
      } else {
        console.log("Error:", res.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async (adId) => {
    try {
      const res = await fetch(
        `${BaseUrl}/user/payment/verfy/${orderId}/${adId}`
      );
      if (res.ok) {
        const data = await res.json();
        console.log(data, ">>>>>>>>data");
        if (data.data.order_status === "PAID") {
          alert("Payment verified");
        }
        fetchBlogs();
      } else {
        console.log("Error:", res.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (adId) => {
    try {
      const sessionId = await getSessionId(adId);
      if (cashfree) {
        const checkoutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: "_modal", // Open in a modal
        };

        cashfree
          .checkout(checkoutOptions)
          .then(() => {
            console.log("Payment Initialized");
          })
          .then(() => {
            verifyPayment(adId);
          })
          .catch((error) => {
            console.error("Error during checkout:", error);
          });
      } else {
        console.log("payment failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to handle changes in duration and update the price
  const handleDurationChange = (e) => {
    const selectedDuration = e.target.value;

    if (selectedDuration === "7") {
      setPrice(999); // Set price to 999 for 7 days
    } else if (selectedDuration === "15") {
      setPrice(1899); // Set price to 1899 for 15 days
    } else if (selectedDuration === "30") {
      setPrice(3799); // Set price to 3799 for 30 days
    }
  };

  // Fetch all blogs initially
  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${BaseUrl}/user/allad/${userId}`, {
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
        setads(data.data); // Adjust this line based on actual response structure
      } else {
        console.error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [userId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/user/profiledata`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProfileData(data.data);
        } else {
          localStorage.clear();
          Navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [token, Navigate]);

  // Handle form submission for creating advertisement
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    setIsLoading(true);

    try {
      const response = await fetch(`${BaseUrl}/user/ad`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Advertisement created successfully:", data);
      fetchBlogs();
      handleCloseModal();
    } catch (error) {
      console.error("Error creating advertisement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdvertisements = async (filter) => {
    try {
      const response = await fetch(
        `${BaseUrl}/user/addstatus/filter/${userId}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        // setads(filter === "pending" ? result.data.pending : result.data.active);
        const filteredAds =
          filter === "active"
            ? result.data.active
            : filter === "pending"
            ? result.data.pending
            : result.data;
        setads(filteredAds);
      }
    } catch (error) {
      console.error("Failed to fetch ads", error);
    }
  };

  useEffect(() => {
    fetchAdvertisements(activeFilter);
  }, [activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

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
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="blog_hero">
            <div className="blog_hero_top d-flex justify-content-between">
              <h3>ALL ({ads?.length})</h3>
              <div className="head_addpost d-flex align-items-center gap-2">
                <button onClick={handleOpenModal}>+ NEW Advertisement</button>
              </div>
            </div>
            <div className="pb-4 d-flex justify-content-center gap-3">
              <button
                className="py-2 px-sm-4 px-2 btn btn-warning text-white rounded"
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </button>
              <button
                className="py-2 px-sm-4 px-2 btn btn-success text-white rounded"
                onClick={() => setActiveFilter("active")}
              >
                Active
              </button>
            </div>
            {ads?.length > 0 ? (
              ads?.map((adds) => (
                <div
                  key={adds._id}
                  className="blog_hero_bottum d-md-flex justify-content-between p-md-4 p-2 mb-4"
                >
                  <div className="blog_hero_detail d-flex align-items-center gap-3">
                    <div className="adds_hero_img">
                      <img src={adds.poster} alt={adds.title} />
                    </div>
                    <div className="blog_hero_text">
                      <h3>{adds.title}</h3>
                      <h4>
                        Published -{" "}
                        {new Date(adds.createdAt).toLocaleDateString("en-IN")}
                      </h4>
                    </div>
                  </div>
                  <div className="blog_hero_crud d-flex align-items-center gap-md-3 gap-2 mt-3 mt-sm-0 justify-content-end">
                    <Link to={`/advertisement/invoice/${adds._id}`}>
                      <button
                        className="py-2 px-sm-4 px-2 btn btn-success text-white rounded"
                        disabled={!adds.paymentClear}
                      >
                        Invoice
                      </button>
                    </Link>
                    {adds.paymentClear ? (
                      <button
                        className="py-2 px-4 btn btn-secondary rounded"
                        disabled
                      >
                        Paid
                      </button>
                    ) : (
                      <button
                        className="py-2 px-4 btn btn-success rounded"
                        disabled={!adds.paynow}
                        onClick={() => handleClick(adds._id)}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center fs-3">No Advertisement Found</p>
            )}
          </div>
          {showModal && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="modal-title">Create New Advertisement</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Poster</label>
                    <input
                      type="file"
                      id="image"
                      name="poster"
                      accept="image/*"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">contact</label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      required
                      className="form-input"
                      maxLength="10"
                      pattern="\d{10}"
                      title="Please enter a 10-digit contact number"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^\d*$/.test(value)) {
                          e.target.value = value.replace(/\D/g, "");
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <select
                      id="duration"
                      name="ad_duration"
                      required
                      className="form-select"
                      onChange={handleDurationChange}
                    >
                      <option value="7">7 days</option>
                      <option value="15">15 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={price}
                      readOnly
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? <div className="spinner"></div> : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Advertisement;
