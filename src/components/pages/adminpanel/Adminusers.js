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
  const [filter, setFilter] = useState("all"); // new state for filtering

  const fetchUsers = async (statusFilter = "all") => {
    try {
      let url = `${BaseUrl}/admin/alluser`; // default fetch URL for all users

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
      const response = await fetch(
        `${BaseUrl}/admin/userdelete/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
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
        const updatedUser = await response.json();
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
        <section>
          <div className="adminsection">
            <h2 className="p-3 text-uppercase">Users</h2>
            <div className="blog_hero">
              <div className="head_search mx-auto mt-3">
                <input
                  type="text"
                  placeholder="Search Users"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="icon" />
              </div>
              <div className="blog_hero_top d-flex gap-5">
                <button
                  className="align-items-center d-flex"
                  onClick={() => handleFilterChange("all")}
                >
                  ALL
                </button>
                <button
                  className="align-items-center d-flex"
                  onClick={() => handleFilterChange("pending")}
                >
                  <FaDotCircle className="pending_btn_icon me-2" />
                  PENDING
                </button>
                <button
                  className="align-items-center d-flex"
                  onClick={() => handleFilterChange("active")}
                >
                  <FaDotCircle className="active_btn_icon me-2" />
                  ACTIVE
                </button>
                <button
                  className="align-items-center d-flex"
                  onClick={() => handleFilterChange("block")}
                >
                  <FaDotCircle className="block_btn_icon me-2" />
                  BLOCK
                </button>
              </div>
              {isSearching ? (
                <p className="text-center fs-3">Searching...</p>
              ) : users?.length > 0 ? (
                users?.map((user) => (
                  <div
                    key={user._id}
                    className="blog_hero_bottum d-sm-flex justify-content-between p-md-4 p-2 mb-4"
                  >
                    <div className="blog_hero_detail d-flex align-items-center gap-3">
                      <div className="user_hero_img">
                        <img src={user.profile} alt={user.fname} />
                      </div>
                      <div className="blog_hero_text">
                        <h3>
                          {user.username} ({user.fname})
                        </h3>
                        <h4>{user.email}</h4>
                        <h6>
                          {user.title} Join Date -{" "}
                          {new Date(user.createdAt).toLocaleDateString("en-IN")}
                        </h6>
                      </div>
                    </div>
                    <div className="blog_hero_crud d-flex align-items-center gap-md-3 gap-2 mt-3 mt-sm-0 justify-content-end">
                      <button
                        className={`status-button ${
                          user.status === "pending" || user.status === "block"
                            ? "activate"
                            : "block"
                        }`}
                        onClick={() =>
                          handleStatusChange(user._id, user.status)
                        }
                      >
                        {user.status === "pending" || user.status === "block"
                          ? "Activate"
                          : "Block"}
                      </button>
                      <i>
                        {loading && loadingId === user._id ? (
                          <div className="loader"></div>
                        ) : (
                          <span onClick={(e) => handleDeleteClick(user._id, e)}>
                            <MdDelete className="delete" />
                          </span>
                        )}
                      </i>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center fs-3">No Users Found</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Adminusers;
