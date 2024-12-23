import React, { useState, useEffect } from "react";
import "./PostCard.css";
import axios from "axios";
import FeedHeader from "./FeedHeader";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
const PostCard = () => {
  const Navigate=useNavigate();
  const [liked, setLiked] = useState(false);
  const [posts, setPosts] = useState(null);
  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return {
      token: userData?.token,
      userId: userData?.id,
    };
  };

  const userposts = async () => {

    try {
      const { token, userId } = getUserData();

      if (!token || !userId) {
        console.error('User not logged in');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/viewAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data);

    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  useEffect(() => {

    userposts();
  }, []);
  console.log(posts)
  let formattedPosts = [];
  if (Array.isArray(posts)) {
    formattedPosts = posts.map(post => ({
      postId: post._id,
      ...post,
      content: post.content.replace(/\\/g, '/'),

    }));

  }



  const handleLike = (postId) => {
    const { userId } = getUserData();

    if (!userId) {
      console.error('User not logged in');
      return;
    }

    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/like/${postId}`, { userId })
      .then((response) => {
       
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likes: post.likes + 1, likedBy: [...post.likedBy, userId] }
              : post
          )
        );
        setLiked(true);
      })
      .catch((error) => {
        console.error('Error liking the post:', error);
      });
  };

  // const handleUnlike = (postId) => {
  //   const { userId } = getUserData();

  //   if (!userId) {
  //     console.error('User not logged in');
  //     return;
  //   }

  //   axios
  //     .post(`http://localhost:3000/post/unlike/${postId}`, { userId })
  //     .then((response) => {

  //       setPosts((prevPosts) =>
  //         prevPosts.map((post) =>
  //           post._id === postId
  //             ? {
  //               ...post,
  //               likes: post.likes - 1,
  //               likedBy: post.likedBy.filter((id) => id !== userId),
  //             }
  //             : post
  //         )
  //       );
  //       setLiked(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error unliking the post:', error);
  //     });
  // };
  const handleUnlike = (postId) => {
    const { userId } = getUserData();
  console.log(userId,'userId')
    if (!userId) {
      console.error('User not logged in');
      return;
    }
  console.log(postId)
    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/unlike/${postId}`, { userId })
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes - 1,
                  likedBy: post.likedBy.filter((id) => id !== userId), 
                }
              : post
          )
        );
        setLiked(false); 
      })
      .catch((error) => {
        console.error('Error unliking the post:', error);
      });
  };
  const handleLogout = () => {
   
    localStorage.removeItem('user');
   
    Navigate('/');
  };
  return (
    <>
      {/* {posts.map((post)=>{ */}
      <FeedHeader ></FeedHeader>
      <div className="post-container">
        {formattedPosts.map((post, index) => (
          <div key={post._id} className="card">

            <div className="card-header">
              <img
                src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}${post.userId?.profilePic}`}
                alt="Profile"
                className="profile-pic"
              />
              <div className="user-info">
                <h3>{post.userId?.name || "Unknown User"}</h3>
                <p>{new Date(post.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>


            <div className="card-content">

<div>{post.description}</div>

              {post.content.endsWith('.mp4') ? (
                <div className="card-video">
                  <video

                    tyle={{ width: '100%' }}
                    autoPlay
                    controls
                    className="post-media">
                    <source src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${post.content}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="card-images">
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${post.content}`}
                    className="post-image"
                    alt={`Post ${index}`}
                  />
                </div>
              )}




            </div>



            <div
              style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              {post.likedBy.includes(getUserData().userId) ? (
                <FaHeart
                  size={24}
                  color="red"
                  onClick={() => handleUnlike(post._id)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
              ) : (
                <FaRegHeart
                  size={24}
                  color="gray"
                  onClick={() => handleLike(post._id)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
              )}
              <span>{post.likes}</span>
            </div>
          </div>


        ))}
      </div>
      <button style={{backgroundColor:"black",color:'white'}}onClick={handleLogout}>Logout</button>
    </>
  );
};

export default PostCard;
