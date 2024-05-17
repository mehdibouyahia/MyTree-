import React, { useState } from "react";
import Axios from "axios";
import styles from './Signup.module.css'; 
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 

    Axios.post("http://localhost:3000/auth/login", { email, password })
      .then((response) => {
        if (response.data.status) {
          navigate('/home');
        } else {
          setError(response.data.message || "An error occurred. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className={styles.signUpContainer}>
      <h2 className={styles.title}>Login</h2>
      <form className={styles.signUpForm} onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="******"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Login</button>
        <Link to="/forgotPassword">Forgot Password?</Link>
        <p>Don't have an Account?</p> <Link to="/signup">Signup</Link>
      </form>
    </div>
  );
};

export default Login;
