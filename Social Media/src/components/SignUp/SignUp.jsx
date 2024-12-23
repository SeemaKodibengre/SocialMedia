
import { Link, useNavigate } from "react-router-dom";
import styles from './styles.module.css';
import { useEffect, useState } from "react";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const googleAuth = () => {
    window.open(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/google`, "_self");
  };

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const Click = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/register`,
        {
          name: data.name,
          email: data.email,
          password: data.password
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      navigate('/login')
      
    } catch (err) {
      console.error('Error:', err);
    }
  };

//   useEffect(() => {
    
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     const userId = urlParams.get('userId');
// console.log(token,userId)
//     if (token && userId) {
     
//       localStorage.setItem("authToken", token);
//       localStorage.setItem("userId", userId);

     
//       navigate("/profile");
//     }
//   }, [navigate]); 
useEffect(() => {
  try {
    

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");

    

    if (token && userId) {
      let user={token:token,id:userId}
		 localStorage.setItem('user',JSON.stringify(user));
     

      navigate("/postcard");
    }
  } catch (error) {
    console.error("Error in useEffect:", error);
  }
}, [navigate]);


  return (
    <div className="white-background">
      <div className={styles.container}>
        <h1 className={styles.heading}>Sign up Form</h1>
        <div className={styles.form_container}>
          <div className={styles.left}>
            <img className={styles.img} src="/images/image6.jpg" alt="signup" />
          </div>
          <div className={styles.right}>
            <h2 className={styles.from_heading}>Create Account</h2>
            <input
              type="text"
              className={styles.input}
              placeholder="Username"
              name="name"
              onChange={Click}
            />
            <input
              type="text"
              className={styles.input}
              placeholder="Email"
              name="email"
              onChange={Click}
            />
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              name="password"
              onChange={Click}
            />
            <button className={styles.btn} onClick={handleSubmit}>Sign Up</button>
            <p className={styles.text}>or</p>
            <button className={styles.google_btn} onClick={googleAuth}>
              <img src="./images/google.png" alt="google icon" />
              <span>Sign up with Google</span>
            </button>
            <p className={styles.text}>
              Already Have an Account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
