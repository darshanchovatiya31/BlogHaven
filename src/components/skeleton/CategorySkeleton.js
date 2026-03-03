import React from "react";
import "./CategorySkeleton.css";

const CategorySkeleton = () => {
  return (
    <div className="row justify-content-between gap-3 gap-lg-0">
      <div className="col-lg-6">
        <div className="category_left border p-3 skeleton-category-card">
          <div className="category_left_img skeleton-image">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="skeleton-date skeleton-shimmer"></div>
          <div className="skeleton-title-large skeleton-shimmer"></div>
          <div className="skeleton-description skeleton-shimmer"></div>
          <div className="skeleton-description skeleton-shimmer" style={{ width: "90%" }}></div>
          <div className="skeleton-description skeleton-shimmer" style={{ width: "70%" }}></div>
          <div className="skeleton-link skeleton-shimmer"></div>
        </div>
      </div>
      <div className="col-lg-6 col-12">
        <div className="category_right border skeleton-category-card">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="row py-3 mx-2 border-bottom align-items-center" key={index}>
              <div className="col-sm-5 ps-2 ps-lg-0 ps-xl-2">
                <div className="category_side_img skeleton-image">
                  <div className="skeleton-shimmer"></div>
                </div>
              </div>
              <div className="col-sm-7 px-0 category_right_inner">
                <div className="skeleton-title-small skeleton-shimmer"></div>
                <div className="skeleton-title-small skeleton-shimmer" style={{ width: "80%" }}></div>
                <div className="skeleton-date-small skeleton-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySkeleton;

