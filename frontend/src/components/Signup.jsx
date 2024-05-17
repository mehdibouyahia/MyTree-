import React, { useState } from "react";
import Axios from "axios";
import styles from './Signup.module.css'; 
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profession, setProfession] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (!email || !password || !lastName || !firstName || !gender) {
      setError("Email, Password, Gender ,Last Name, and First Name are required.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("lastName", lastName);
    formData.append("firstName", firstName);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("profession", profession);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);
    formData.append("photo", photo);


    Axios.post("http://localhost:3000/auth/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        if (response.data.status) {
          navigate("/login");
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
      <h2 className={styles.title}>Sign Up</h2>
      <form className={styles.signUpForm} onSubmit={handleSubmit}>
        <label htmlFor="email">**Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">**Password:</label>
        <input
          type="password"
          placeholder="******"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="lastName">**Last Name:</label>
        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="firstName">**First Name:</label>
        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="gender">**Gender:</label>
        <div className={styles.genderDropdown}>
          <select onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input
          type="date"
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <label htmlFor="profession">Profession:</label>
        <input
          type="text"
          placeholder="Profession"
          onChange={(e) => setProfession(e.target.value)}
        />
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          placeholder="Phone Number"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <label htmlFor="photo">Photo:</label>
        <input type="file" accept="image/jpeg, image/jpg" onChange={handlePhotoChange} />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Sign Up</button>
        <p>Have an Account?</p>
        <Link to="/login">Login</Link>
      </form>
    </div>
  );
};

export default Signup;
