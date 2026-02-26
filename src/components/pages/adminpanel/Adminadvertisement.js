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
        <section className="admin-ads-section">
          <div className="adminsection">
            <div className="admin-ads-header">
              <h1 className="admin-ads-title">Advertisements</h1>
              <p className="admin-ads-subtitle">Manage all advertisements and their payment status</p>
            </div>
            <div className="admin-ads-content">
              <div className="admin-ads-stats">
                <div className="ads-count">
                  <span className="ads-count-label">Total Advertisements</span>
                  <span className="ads-count-value">{ads?.length || 0}</span>
                </div>
              </div>
              {ads?.length > 0 ? (
                <div className="admin-ads-list">
                  {ads.map((ad) => (
                    <div key={ad._id} className="admin-ad-card">
                      <div className="admin-ad-info">
                        <div className="admin-ad-image">
                          <img src={ad.poster} alt={ad.title} />
                          <span className={`ad-status-badge status-${ad.status || 'pending'}`}>
                            {ad.status || 'pending'}
                          </span>
                        </div>
                        <div className="admin-ad-details">
                          <h3 className="admin-ad-title">{ad.title}</h3>
                          <div className="admin-ad-meta">
                            <div className="admin-ad-author">
                              <img src={ad.userId?.profile} alt={ad.userId?.fname} />
                              <span>{ad.userId?.fname}</span>
                            </div>
                            <span className="admin-ad-date">
                              Published: {new Date(ad.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </span>
                            {ad.lastTime && (
                              <span className="admin-ad-expiry">
                                Expires: {new Date(ad.lastTime).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })}
                              </span>
                            )}
                          </div>
                          <div className="admin-ad-payment-info">
                            <div className="payment-status">
                              <GoDotFill className={`payment-dot ${ad.paymentClear ? 'paid' : 'unpaid'}`} />
                              <span className="payment-label">
                                {ad.paymentClear ? 'Payment Cleared' : 'Payment Pending'}
                              </span>
                            </div>
                            {ad.price && (
                              <span className="ad-price">₹{ad.price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="admin-ad-actions">
                        <div className="admin-ad-toggle">
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={ad.paynow === 1}
                              onChange={() => handleToggle(ad._id)}
                              disabled={ad.paynow === 1}
                            />
                            <span className="toggle-slider"></span>
                            <span className="toggle-label">
                              {ad.paynow === 1 ? "Payment Enabled" : "Payment Disabled"}
                            </span>
                          </label>
                        </div>
                        <button
                          className={`admin-activate-btn ${ad.status === "active" ? "activated" : ""}`}
                          onClick={() => handleStatusChange(ad._id)}
                          disabled={
                            ad.paymentClear === false || ad.status === "active" || loadingAdId === ad._id
                          }
                        >
                          {loadingAdId === ad._id ? (
                            <div className="action-spinner"></div>
                          ) : activatedAds.includes(ad._id) || ad.status === "active" ? (
                            "Activated"
                          ) : (
                            "Activate"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-ads-empty">
                  <p>No advertisements found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Adminadvertisement;
