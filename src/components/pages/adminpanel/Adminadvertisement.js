import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import { GoDotFill } from "react-icons/go";
import { BaseUrl } from "../../Service/Url";

const Adminadvertisement = () => {
  const [ads, setAds] = useState([]);
  const [loadingAdId, setLoadingAdId] = useState(null); // To track the ad being activated
  const [activatedAds, setActivatedAds] = useState([]); // To store activated ad IDs

  // Fetch the ads data from API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${BaseUrl}/admin/allads`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAds(data.data);
        } else {
          console.error("Failed to fetch ads");
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  // Handle toggle switch for payment status
  const handleToggle = async (adId) => {
    try {
      const response = await fetch(`${BaseUrl}/admin/paynow/${adId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

      if (response.ok) {
        // Update the ad's payment status locally
        setAds((prevAds) =>
          prevAds.map((ad) =>
            ad._id === adId ? { ...ad, paynow: ad.paynow === 1 ? 0 : 1 } : ad
          )
        );
      } else {
        console.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  // Handle status change to activate the ad
  const handleStatusChange = async (adId) => {
    setLoadingAdId(adId); // Show loader for this ad
    try {
      const response = await fetch(`${BaseUrl}/admin/status/active/${adId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

      if (response.ok) {
        console.log("Advertisement activated successfully");
        setActivatedAds((prev) => [...prev, adId]); // Add the adId to activated ads
      } else {
        console.error("Failed to activate advertisement");
      }
    } catch (error) {
      console.error("Error activating advertisement:", error);
    } finally {
      setLoadingAdId(null); // Hide loader
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
            <h2 className="p-3 text-uppercase">Advertisement</h2>
            <div className="blog_hero">
              <div className="blog_hero_top d-flex justify-content-between">
                <h3>ALL ({ads?.length})</h3>
              </div>
              {ads?.length > 0 ? (
                ads?.map((ad) => (
                  <div
                    key={ad._id}
                    className="blog_hero_bottum d-sm-flex justify-content-between p-md-4 p-2 mb-4"
                  >
                    <div className="blog_hero_detail d-flex align-items-center gap-3">
                      <div className="blog_hero_img">
                        <img src={ad.poster} alt="" />
                      </div>
                      <div className="blog_hero_text">
                        <h4>
                          {ad.title}
                          <h5 className="fs-5">
                            Published -{" "}
                            {new Date(ad.createdAt).toLocaleDateString("en-IN")}
                          </h5>
                        </h4>
                        <div className="d-flex admin_post_userdata">
                          <img src={ad.userId.profile} alt="" />
                          <h4 className="mb-0"> {ad.userId.fname}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-md-3 gap-2 mt-3 mt-sm-0 justify-content-end">
                      <h5>
                        Payment{" "}
                        <GoDotFill
                          className={
                            ad.paymentClear === false
                              ? "text-danger"
                              : "text-success"
                          }
                        />
                      </h5>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id={`flexSwitchCheckDefault-${ad._id}`}
                          checked={ad.paynow === 1}
                          onChange={() => handleToggle(ad._id)}
                          disabled={ad.paynow === 1} // Disable if paynow is true
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`flexSwitchCheckDefault-${ad._id}`}
                        >
                          {ad.paynow === 1 ? "On" : "Off"}
                        </label>
                      </div>
                      <button
                        className="py-2 px-4 btn btn-success rounded"
                        onClick={() => handleStatusChange(ad._id)}
                        disabled={
                          ad.paymentClear === false || ad.status === "active"
                        }
                      >
                        {loadingAdId === ad._id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : activatedAds.includes(ad._id) ||
                          ad.status === "active" ? (
                          "Activated"
                        ) : (
                          "Active"
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center fs-3">No Advertisement Found</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Adminadvertisement;
