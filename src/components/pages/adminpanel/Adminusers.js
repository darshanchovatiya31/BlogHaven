import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import "../adminpanel/Adminpanel.css";
import { MdDelete } from "react-icons/md";
import { FaDotCircle, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../../Service/Url";

const Adminusers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchUsers = async (statusFilter = "all") => {
    try {
      let url = `${BaseUrl}/admin/alluser`;

      if (statusFilter !== "all") {
        url = `${BaseUrl}/admin/status/filter?status=${statusFilter}`;
      }

      const response = await fetch(url, {
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

      if (statusFilter === "all") {
        setUsers(data.data); // setting users when no filter is applied
      } else {
        setUsers(data.data[statusFilter]); // set users based on the filtered status
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilterChange = (status) => {
    setFilter(status);
    fetchUsers(status); // Fetch users based on selected filter
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 0) {
      setIsSearching(true);
      try {
        const response = await fetch(
          `${BaseUrl}/admin/user/searching?username=${query}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const result = await response.json();

        if (Array.isArray(result.data)) {
          setUsers(result.data);
        } else {
          setUsers([]);
          toast.info("No users found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching user data");
      } finally {
        setIsSearching(false);
      }
    } else {
      fetchUsers(filter); // Re-fetch users based on the current filter if search is cleared
    }
  };

  const handleDeleteClick = async (userId, e) => {
    e.stopPropagation();
    setLoading(true);
    setLoadingId(userId);
    try {
      const response = await fetch(`${BaseUrl}/admin/userdelete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully", { autoClose: 1500 });
      } else {
        toast.error("Failed to delete user", { autoClose: 1500 });
      }
    } catch (error) {
      toast.error("Error deleting user");
    } finally {
      setLoading(false);
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    let newStatus;
    if (currentStatus === "pending" || currentStatus === "block") {
      newStatus = "active"; // Activate if pending or blocked
    } else if (currentStatus === "active") {
      newStatus = "block"; // Block if currently active
    }

    try {
      const response = await fetch(
        `${BaseUrl}/admin/user/status?userId=${userId}&status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
      if (response.ok) {
        await response.json();
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, status: newStatus } : user
          )
        );
        toast.success(`User status changed to ${newStatus}`, {
          autoClose: 1500,
        });
      } else {
        toast.error("Failed to update user status", { autoClose: 1500 });
      }
    } catch (error) {
      toast.error("Error updating user status", { autoClose: 1500 });
    }
  };

  return (
    <>
      <div className="adminpanel">
        <div className="admin_head">
          <AdminHeader />
        </div>
        <section className="admin-users-section">
          <div className="adminsection">
            <div className="admin-users-header">
              <h1 className="admin-users-title">Users</h1>
              <p className="admin-users-subtitle">Manage all platform users and their status</p>
            </div>
            <div className="admin-users-content">
              <div className="admin-users-search">
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search users by username..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
              </div>
              <div className="admin-users-filters">
                <button
                  className={`filter-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => handleFilterChange("all")}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filter === "pending" ? "active" : ""}`}
                  onClick={() => handleFilterChange("pending")}
                >
                  <FaDotCircle className="filter-icon pending" />
                  Pending
                </button>
                <button
                  className={`filter-btn ${filter === "active" ? "active" : ""}`}
                  onClick={() => handleFilterChange("active")}
                >
                  <FaDotCircle className="filter-icon active" />
                  Active
                </button>
                <button
                  className={`filter-btn ${filter === "block" ? "active" : ""}`}
                  onClick={() => handleFilterChange("block")}
                >
                  <FaDotCircle className="filter-icon block" />
                  Blocked
                </button>
              </div>
              {isSearching ? (
                <div className="admin-users-loading">
                  <div className="loading-spinner"></div>
                  <p>Searching users...</p>
                </div>
              ) : users?.length > 0 ? (
                <div className="admin-users-list">
                  {users.map((user) => (
                    <div key={user._id} className="admin-user-card">
                      <div className="admin-user-info">
                        <div className="admin-user-avatar">
                          <img src={user.profile} alt={user.fname} />
                          <span className={`status-badge status-${user.status}`}>
                            {user.status}
                          </span>
                        </div>
                        <div className="admin-user-details">
                          <h3 className="admin-user-name">
                            {user.username} <span className="admin-user-fullname">({user.fname})</span>
                          </h3>
                          <p className="admin-user-email">{user.email}</p>
                          <p className="admin-user-date">
                            Joined: {new Date(user.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="admin-user-actions">
                        <button
                          className={`admin-status-btn ${
                            user.status === "pending" || user.status === "block"
                              ? "activate"
                              : "block"
                          }`}
                          onClick={() => handleStatusChange(user._id, user.status)}
                        >
                          {user.status === "pending" || user.status === "block"
                            ? "Activate"
                            : "Block"}
                        </button>
                        <button
                          className="admin-delete-btn"
                          onClick={(e) => handleDeleteClick(user._id, e)}
                          disabled={loading && loadingId === user._id}
                        >
                          {loading && loadingId === user._id ? (
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
                <div className="admin-users-empty">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Adminusers;
