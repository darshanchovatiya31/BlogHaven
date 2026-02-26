import React, { useEffect, useState, useCallback } from "react";
import AdminHeader from "./AdminHeader";
import "../adminpanel/Adminpanel.css";
import { BaseUrl } from "../../Service/Url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
// Skeleton components removed - using simple loading states instead

const Admincategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const token = localStorage.getItem("admintoken");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/admin/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 0) {
      try {
        const filtered = categories.filter((cat) =>
          cat.name.toLowerCase().includes(query.toLowerCase())
        );
        setCategories(filtered);
      } catch (error) {
        console.error(error);
        toast.error("Error searching categories");
      }
    } else {
      fetchCategories();
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCategory
        ? `${BaseUrl}/admin/category/update/${editingCategory._id}`
        : `${BaseUrl}/admin/category/create`;

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          editingCategory
            ? "Category updated successfully"
            : "Category created successfully"
        );
        handleCloseModal();
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setLoading(true);
    setLoadingId(categoryId);
    try {
      const response = await fetch(`${BaseUrl}/admin/category/delete/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    } finally {
      setLoading(false);
      setLoadingId(null);
    }
  };

  const handleToggleStatus = async (categoryId) => {
    setLoading(true);
    setLoadingId(categoryId);
    try {
      const response = await fetch(
        `${BaseUrl}/admin/category/toggle/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to update category status");
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error("Error updating category status");
    } finally {
      setLoading(false);
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="adminpanel">
        <div className="admin_head">
          <AdminHeader />
        </div>
        <section className="admin-categories-section">
          <div className="adminsection">
            <div className="admin-categories-header">
              <div>
                <h1 className="admin-categories-title">Categories</h1>
                <p className="admin-categories-subtitle">Manage blog post categories and their status</p>
              </div>
              <button
                className="admin-add-category-btn"
                onClick={() => handleOpenModal()}
              >
                <MdAdd />
                <span>Add Category</span>
              </button>
            </div>
            <div className="admin-categories-content">
              <div className="admin-categories-search">
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search categories by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
              </div>
              <div className="admin-categories-stats">
                <div className="categories-count">
                  <span className="categories-count-label">Total Categories</span>
                  <span className="categories-count-value">{categories?.length || 0}</span>
                </div>
              </div>
              {loading ? (
                <div className="admin-categories-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading categories...</p>
                </div>
              ) : categories?.length > 0 ? (
                <div className="admin-categories-grid">
                  {categories.map((category) => (
                    <div key={category._id} className="admin-category-card">
                      <div className="admin-category-header">
                        <div className="admin-category-info">
                          <h3 className="admin-category-name">{category.name}</h3>
                          <span
                            className={`admin-category-status ${
                              category.isActive ? "active" : "inactive"
                            }`}
                            onClick={() => handleToggleStatus(category._id)}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      {category.description && (
                        <p className="admin-category-description">
                          {category.description}
                        </p>
                      )}
                      <div className="admin-category-actions">
                        <button
                          className="admin-category-edit-btn"
                          onClick={() => handleOpenModal(category)}
                          disabled={loading && loadingId === category._id}
                        >
                          <MdEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          className="admin-category-delete-btn"
                          onClick={() => handleDelete(category._id)}
                          disabled={loading && loadingId === category._id}
                        >
                          {loading && loadingId === category._id ? (
                            <div className="action-spinner"></div>
                          ) : (
                            <>
                              <MdDelete />
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-categories-empty">
                  <p>No categories found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Modal for Create/Edit Category */}
      {showModal && (
        <div className="admin-category-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-category-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-category-modal-title">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h2>
            <form className="admin-category-modal-form" onSubmit={handleSubmit}>
              <div className="admin-category-form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="admin-category-form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter category name"
                />
              </div>
              <div className="admin-category-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="admin-category-form-input"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter category description (optional)"
                />
              </div>
              {editingCategory && (
                <div className="admin-category-form-group">
                  <label className="admin-category-checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="admin-category-checkbox"
                    />
                    <span>Active Status</span>
                  </label>
                </div>
              )}
              <div className="admin-category-form-actions">
                <button
                  type="button"
                  className="admin-category-cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-category-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="action-spinner"></div>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Admincategories;

