import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import { useState } from "react";
import axios from "axios";

function SignIn() {
	const Navigate=useNavigate()
	// const googleAuth = () => {
	// 	window.open(
	// 		`${process.env.REACT_APP_API_URL}/auth/google/callback`,
	// 		"_self"
	// 	);
	// };
	const [item,setItem]=useState('');
	const Click=(e)=>{
setItem({...item,[e.target.name]:e.target.value})

	};
	console.log(item)
	const handleSubmit = async (event) => {
        event.preventDefault();
	
        try {
          const response = await axios.post(
           `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/login`,
            {
             
              email: item.email,
              password: item.password
            },
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
		 const id=response.data.id;
         const token= response.data.token;
let user={token:token,id:id}
		 localStorage.setItem('user',JSON.stringify(user));
		 Navigate('/postcard')
        } catch (err) {
          console.error('Error:', err);
        }
      };
	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Log in Form</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="/images/image4.jpg" alt="login" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Log in</h2>
				
										<input type="text" className={styles.input} placeholder="Email" name="email" onChange={(e)=>Click(e)} />
										<input
											type="password"
											className={styles.input}
											placeholder="Password"
											name="password"
											onChange={(e)=>Click(e)}
										/>
					<button className={styles.btn} onClick={handleSubmit}>Log In</button>
					<p className={styles.text}>or</p>
					{/* <button className={styles.google_btn} onClick={googleAuth}>
						<img src="./images/google.png" alt="google icon" />
						<span>Sing in with Google</span>
					</button> */}
					<p className={styles.text}>
						New Here ? <Link to="/register">Sing Up</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
