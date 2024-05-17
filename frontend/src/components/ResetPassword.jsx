import React, { useState } from "react";
import Axios from "axios";
import styles from './Signup.module.css'; 
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 

    Axios.post(`http://localhost:3000/auth/reset-password/${token}`, { password })
      .then(response => {
        if (response.data.status) {
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
      <h2 className={styles.title}>Reset Password</h2>
      <form className={styles.signUpForm} onSubmit={handleSubmit}>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          placeholder="******"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>} 

        <button type="submit">Reset</button>
      </form>
    </div>
  );
}

export default ResetPassword;
