
import React, { useState, useEffect } from "react";
import "./ProfileEdit.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt } from 'react-icons/fa';

const ProfileEdit = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [user, setUser] = useState({});
  const [preview, setPreview] = useState(null);

  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
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
          console.error("User not logged in");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);

      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();

  }, []);



  const Click = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const ClickProfile = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file && allowedTypes.includes(file.type)) {
      setPreview(URL.createObjectURL(file));
      setUser({ ...user, profilePic: file });
    } else {
      console.log("Invalid file type. Please upload an image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { token, userId } = getUserData();
    try {
      const formData = new FormData();


      for (const key in user) {
        if (user[key] instanceof File) {
          formData.append(key, user[key]);
        } else {
          formData.append(key, user[key]);
        }
      }




      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/update/${userId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated successfully!", {
        autoClose: 3000
      });
      setTimeout(() => {
        onClose();
      }, 3000)

    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <>
      <ToastContainer />
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Edit Profile</h2>
          <div className="profile-wrapper">
            <div className="profile-icon">

              {preview ? (
                <img src={preview} alt="Profile Preview" />
              ) : user?.profilePic ? (
                <img src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}${user?.profilePic}`} alt="Profile" />
              ) : (
                <div className="profile-initial">{getInitial(user.name)}</div>
              )}
              <input
                type="file"
                id="profileInput"
                onChange={ClickProfile}
                name="profilePic"
                accept="image/*"
                style={{ display: "none" }}
              />

              {/* Pencil icon */}
              <label htmlFor="profileInput" className="edit-icon">
              <FaPencilAlt />
              </label>
            </div>
          </div>
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name || ""}
                onChange={Click}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={user.bio || ""}
                onChange={Click}
              />
            </div>
            <button
              type="submit"

              style={{ backgroundColor: "black", color: "white", width: "100%" }}
            >
              Save
            </button>
          </form>
        </div>

      </div>
    </>
  );
};

export default ProfileEdit;



