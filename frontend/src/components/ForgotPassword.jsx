import React, { useState } from "react";
import Axios from "axios";
import styles from './Signup.module.css'; 
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 

    Axios.post("http://localhost:3000/auth/forgot-password", { email })
      .then(response => {
        if (response.data.status) {
          alert("Check your email for reset password link");
          navigate('/login');
        } else {
          setError(response.data.message || "An error occurred. Please try again.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className={styles.signUpContainer}>
      <h2 className={styles.title}>Forgot Password</h2>
      <form className={styles.signUpForm} onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>} 

        <button type="submit">Send</button>
        <p>Have an Account?</p> <Link to="/login">Login</Link>
      </form>
    </div>
  );
}

export default ForgotPassword;
