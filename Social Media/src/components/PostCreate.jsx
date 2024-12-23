



import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons'; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoFileDirectoryFill } from "react-icons/go";
const UploadUI = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  const [cameraActive, setCameraActive] = useState(false);
  const [description, setDescription] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
const navigate=useNavigate();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        !selectedFile.type.startsWith("image/") &&
        !selectedFile.type.startsWith("video/")
      ) {
        toast.error("Please upload a valid image or video file.");
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {  // Increased size limit to 50MB for video
        toast.error("File size must be less than 50MB.");
        return;
      }
      setFile(selectedFile);
      setCameraActive(false);
    }
  };

  const handleCameraClick = () => {
    setCameraActive(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => toast.error("Camera access error: " + err.message));
  };

  const handleCapture = () => {
    // const context = canvasRef.current.getContext("2d");
    // context.drawImage(videoRef.current, 0, 0, 300, 200);
    // const dataUrl = canvasRef.current.toDataURL("image/png");
    // setFile(dataUrl);
    // stopCamera();
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 200);
    const dataUrl = canvasRef.current.toDataURL("image/png");
  
    // Convert Data URL to Blob
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([uintArray], { type: "image/png" });
  
    setFile(blob); 
    const previewUrl = URL.createObjectURL(blob);
    setImagePreview(previewUrl);
   
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return {
      token: userData?.token || "",
      userId: userData?.id || "",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const { token, userId } = getUserData();
    if (!file) {
      toast.error("Please upload or capture an image.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("file", file); 
      formData.append("userId", userId);
      formData.append("type", "image");
      formData.append("description", description);
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
        toast.success("Post created successfully!", {
            autoClose: 3000,
        });
   navigate('/profile')
    } catch (err) {
        
        toast.error("Failed to create the post.",err);
    }
  };

  return (
    <div style={styles.container}>
      <textarea
        className="text"
        name="description"
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Type something..."
        style={styles.text}
      />

     
      <div style={styles.imagePreview}>
        {file ? (
          <p style={styles.placeholderText}>File ready to be uploaded</p>
        ) : (
          <p style={styles.placeholderText}>No file selected</p>
        )}
      </div>
     
      {imagePreview && (
        <div>
          <h3>Image Preview:</h3>
          <img src={imagePreview} alt="Preview" width="300" />
        </div>
      )}
   

      {cameraActive && (
        <div style={styles.cameraContainer}>
          <video ref={videoRef} style={styles.video} />
          <button style={styles.captureButton} onClick={handleCapture}>
            Capture
          </button>
        </div>
      )}

      <div style={styles.options}>
        <label style={styles.option}>
          <span role="img" aria-label="folder" style={styles.icon}>
          <GoFileDirectoryFill />
          </span>
          <span>Choose File</span>
          <input
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </label>
        <div style={styles.option} onClick={handleCameraClick}>
          <span role="img" aria-label="camera" style={styles.icon}>
            <FontAwesomeIcon icon={faCamera} size="1x" style={{ color: 'black', marginBottom: '2px' }} />
          </span>
          <span>Camera</span>
        </div>
      </div>

      <button style={styles.createButton} onClick={handleSubmit}>
        CREATE
      </button>

      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        style={{ display: "none" }}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100%",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
  },
  imagePreview: {
    width: "80%",
    height: "200px",
    backgroundColor: "#e0e0e0",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  placeholderText: {
    color: "#aaa",
  },
  options: {
    display: "flex",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: "20px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    textAlign: "center",
  },
  fileInput: {
    display: "none",
  },
  createButton: {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
  cameraContainer: {
    position: "relative",
    width: "80%",
    height: "200px",
    marginBottom: "20px",
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
    backgroundColor: "#000",
  },
  captureButton: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#000",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  text: {
    backgroundColor:'#aaa',
    width: "80%",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    color: "gray",
    marginBottom: "20px",
  },
};

export default UploadUI;
