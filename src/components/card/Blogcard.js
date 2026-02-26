import React, { useEffect, useState } from "react";
import "../card/Blogcard.css";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BaseUrl } from "../Service/Url";

const Blogcard = ({ Blogs }) => {
  const [liked, setLiked] = useState(false); // To store like status
  const [count, setCount] = useState(0); // To store like count
  const Navigate = useNavigate();

  // Function to handle the like/unlike action
  const toggleLike = async (blogId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      Navigate("/login");
      return;
    }

    // Define the like/unlike API endpoint with blogId and userId
    const likeUrl = `${BaseUrl}/user/blog/like/unlike/${blogId}/${userId}`;

    try {
      // Perform the API call
      const response = await fetch(likeUrl, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update like status");
      }

      const result = await response.json();
      console.log("Like/Unlike response:", result);

      // Check if the current userId is in the like array and update the liked state
      if (result.data.like.includes(userId)) {
        setLiked(true);
      } else {
        setLiked(false);
      }

      // Optionally refetch the like count after updating
      LikeCount(blogId);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  // Function to fetch the current like count
  const LikeCount = async (blogId) => {
    try {
      const res = await fetch(`${BaseUrl}/user/blog/likeCounts/${blogId}`);
      const data = await res.json();
      setCount(data.data);
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  // Check if the user has liked the post when the component mounts
  const checkUserLikedStatus = async () => {
    const userId = localStorage.getItem("userId");
    if (Blogs.like.includes(userId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  // Fetch like count and check if the user has liked the Blogs on component mount
  useEffect(() => {
    LikeCount(Blogs._id); // Fetch like count
    checkUserLikedStatus(); // Check if the user has already liked the Blogs
  }, [Blogs._id]);

  return (
    <>
      <div className="blog-card-wrapper">
        <div className="blog-card">
          <div className="blog-card-image-wrapper">
            <img
              src={Blogs.blogimg}
              className="blog-card-image"
              alt={Blogs.title}
            />
            {Blogs.category && (
              <span className="blog-card-category">{Blogs.category}</span>
            )}
          </div>
          <div className="blog-card-content">
            <h2 className="blog-card-title europa_bold">{Blogs.title}</h2>
            
            <div className="blog-card-meta">
              <div className="blog-card-author">
                <img
                  src={Blogs.userId.profile}
                  alt={Blogs.userId.username}
                  className="blog-card-avatar"
                />
                <span className="blog-card-author-name europa_bold">
                  {Blogs.userId.username}
                </span>
              </div>
              <span className="blog-card-date europa_reg">
                {new Date(Blogs.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </span>
            </div>

            <p className="blog-card-description europa_reg">
              {Blogs.maindescription}
            </p>

            <div className="blog-card-footer">
              <Link
                to={`/blogsingle/${Blogs._id}`}
                className="blog-card-link europa_bold"
              >
                Read More
              </Link>
              <div className="blog-card-likes" onClick={() => toggleLike(Blogs._id)}>
                <span className="blog-card-like-count europa_bold">{count}</span>
                {liked ? (
                  <FaHeart className="blog-card-heart-icon liked" />
                ) : (
                  <FaRegHeart className="blog-card-heart-icon" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogcard;
