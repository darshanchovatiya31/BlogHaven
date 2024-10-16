import React, { useEffect, useState } from 'react'
import "../card/Blogcard.css";
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { BaseUrl } from '../Service/Url';

const Blogcard = ({ Blogs }) => {
  const [liked, setLiked] = useState(false);  // To store like status
  const [count, setCount] = useState(0);  // To store like count
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
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      const result = await response.json();
      console.log('Like/Unlike response:', result);

      // Check if the current userId is in the like array and update the liked state
      if (result.data.like.includes(userId)) {
        setLiked(true);
      } else {
        setLiked(false);
      }

      // Optionally refetch the like count after updating
      LikeCount(blogId);
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  // Function to fetch the current like count
  const LikeCount = async (blogId) => {
    try {
      const res = await fetch(`${BaseUrl}/user/blog/likeCounts/${blogId}`);
      const data = await res.json();
      setCount(data.data); 
    } catch (error) {
      console.error('Error fetching like count:', error);
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
    LikeCount(Blogs._id);  // Fetch like count
    checkUserLikedStatus();  // Check if the user has already liked the Blogs
  }, [Blogs._id]);

  return (
    <>
      <div className="card border-0 mb-5">
        <img
          src={Blogs.blogimg}
          className="card-img-top rounded-0"
          alt="post img"
        />
        <div className="card-body mt-3 p-0">
          <h2 className="card-title europa_bold mb-2">{Blogs.title}</h2>
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-1">
            <div className="d-flex gap-2 align-items-center">
              <img
                src={Blogs.userId.profile}
                alt=""
                width="35px"
                height="35px"
                className="rounded-circle"
              />
              <h6 className="mb-0 europa_bold pername">
                {Blogs.userId.username}
              </h6>
            </div>
            <div className="gap-lg-3 d-flex justify-content-between card_share">
              <span className="post-date europa_reg me-2">
                {new Date(Blogs.createdAt).toLocaleDateString("en-IN")}
              </span>
              <span className="post-date  europa_reg ">
                <CiShare2 className="fs-4" /> 1K Shares
              </span>
            </div>
          </div>
          <p className="card-text europa_reg mb-1">{Blogs.maindescription}</p>
          <div className="d-flex justify-content-between align-items-center">
            <Link
              to={`/blogsingle/${Blogs._id}`}
              className="text-decoration-none europa_bold text-black view_btn"
            >
              View Post
            </Link>
            <div className="d-flex align-items-center gap-2">
              <span className="europa_bold likes">{count}</span>
              <span
                className="europa_bold "
                onClick={()=>toggleLike(Blogs._id)}
                style={{ cursor: "pointer" }}
              >
                {liked ? (
                  <FaHeart className="text-danger heart-icon fs-4" />
                ) : (
                  <FaRegHeart className="fs-4" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogcard
