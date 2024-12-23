import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeedHeader = () => {
const navigate=useNavigate();
  const [user, setUser] = useState(null); 

  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return {
      token: userData?.token,
      userId: userData?.id,
    };
  };

  useEffect(() => {
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
        console.log(user,'data')
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!user) {
   
    return <div>Loading...</div>;
  }

  const getInitial = (name) => {
   
    return name ? name.charAt(0).toUpperCase() : '?';
  };
const handleProfile=()=>{
    navigate('/profile')
}
  return (
    <div style={styles.container}>
     {user.profilePic ? (
        <img
          src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}${user.profilePic}`}
          alt="Profile"
          style={styles.profilePic}
          onClick={handleProfile}
        />
      ) : (
        <div style={styles.profileIcon}  onClick={handleProfile}>
          {getInitial(user.name)}
        </div>
        
      )}
     <h2 style={styles.welcomeText}>
  <div style={{ fontSize: '18px', color: '#555' }}>Welcome Back,</div>
  <span style={styles.username}>{user.name || 'User'}</span>
</h2>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  profilePic: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover', 
  },
  profileIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#E75480', 
    color: '#fff', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '50px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  welcomeText: {
    fontWeight: "bold",
    fontSize: "24px",
    color: "#333",
    margin: "0",
  },
  username: {
    display: "block", 
    fontSize: "28px",
    color: "#212121", 
    marginTop: "4px",
  },
};

export default FeedHeader;
