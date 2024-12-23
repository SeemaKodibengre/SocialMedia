import React, { useState, useEffect } from "react";
import './ProfilePage.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileEdit from "./ProfileEdit";
import { FaPlusCircle } from "react-icons/fa";
const ProfilePage = () => {

  const Navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState(false);
  const [posts, setPosts] = useState(null)
  const openModal = () => setModalOpen(true);

  const [user, setUser] = useState(null);
  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return {
      token: userData?.token,
      userId: userData?.id,
    };
  };

  const closeModal = () => {
    setModalOpen(false);
    fetchUserDetails();
  };
  const fetchUserDetails = async () => {

    try {
      const { token, userId } = getUserData();

      if (!token || !userId) {
        console.error('User not logged in');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);

    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const userposts = async () => {

    try {
      const { token, userId } = getUserData();

      if (!token || !userId) {
        console.error('User not logged in');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/view?userId=${userId}`,
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
    fetchUserDetails();
    userposts();
  }, []);

  if (!user) {

    return <div>Loading...</div>;
  }

  const getInitial = (name) => {

    return name ? name.charAt(0).toUpperCase() : '?';
  };

  let formattedPosts = [];
  if (Array.isArray(posts)) {
    formattedPosts = posts.map(post => ({
      ...post,
      content: post.content.replace(/\\/g, '/'),
    }));
  }
  const Click = () => {
    Navigate('/create')
  }


  const handleLogout = () => {
   
    localStorage.removeItem('user');
   
    Navigate('/');
  };
  const Back = () => {
   
 
   
    Navigate('/postcard');
  };
  return (
    <div className="containerPost">
      <div className="profile-banner"></div>

      <div className="profile-header">
        {user?.profilePic ? (
          <img src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}${user?.profilePic}`} alt="Profile" className="profile-image" />
        ) : (
          <div className="profileIcon">
            {getInitial(user.name)}</div>
        )}


        <button className="edit-button" onClick={openModal}>
          Edit Profile
        </button>
        {/* </div> */}

      </div>
      <button style={{backgroundColor:"white",color:'black'}}onClick={Back}>Back</button>
      <div className="user-info">
        <h2 className="user-info-heading">{user.name}</h2>
        <p style={{ fontSize: '3rem' }}>
          {user.bio} 💕
        </p>
      </div>

      <h3 style={{ fontSize: '3rem' }}>My Posts</h3>





      <div className="posts-container">
        {formattedPosts.map((post, index) => (
          <div key={index} className="post-card">
            {post.content.endsWith('.mp4') ? (
              <video

                tyle={{ width: '100%' }}
                autoPlay
                controls
                className="post-media">
                <source src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${post.content}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${post.content}`}
                className="post-image"
                alt={`Post ${index}`}
              />
            )}
          </div>
        ))}
      </div>

      <FaPlusCircle className='AddIcon' onClick={Click} />
      <button style={{backgroundColor:"black",color:'white'}}onClick={handleLogout}>Logout</button>
      <ProfileEdit isOpen={isModalOpen} onClose={closeModal} />
      
    </div>
  );
};

export default ProfilePage;
