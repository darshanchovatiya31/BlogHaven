import React from "react";
import "./BlogCardSkeleton.css";

const BlogCardSkeleton = () => {
  return (
    <div className="blog-card-wrapper">
      <div className="blog-card skeleton-card">
        <div className="blog-card-image-wrapper skeleton-image">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="blog-card-content">
          <div className="skeleton-title skeleton-shimmer"></div>
          <div className="skeleton-title skeleton-shimmer" style={{ width: "70%" }}></div>
          
          <div className="blog-card-meta">
            <div className="blog-card-author">
              <div className="blog-card-avatar skeleton-avatar skeleton-shimmer"></div>
              <div className="skeleton-author skeleton-shimmer"></div>
            </div>
            <div className="skeleton-date skeleton-shimmer"></div>
          </div>

          <div className="skeleton-description skeleton-shimmer"></div>
          <div className="skeleton-description skeleton-shimmer" style={{ width: "80%" }}></div>

          <div className="blog-card-footer">
            <div className="skeleton-likes skeleton-shimmer"></div>
            <div className="skeleton-readmore skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;

