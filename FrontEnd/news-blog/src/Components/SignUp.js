import React, { useState } from "react";
import Axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [signupStatus, setsignupStatus] = useState("");
  // console.log(formData);
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const SignUp = () => {
    Axios.post("http://localhost:3001/signup", {
      userName: formData.userName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    }).then((response) => {
      // console.log(response.data);
      setsignupStatus(response.data);
    });
  };

  return (
    <div>
      <div className="form--container">
        <div className="form--banner">
          <h3>New User?</h3>
          <h1>Sign Up Now</h1>
          <img className="form--img" src="images/signupimg.png" alt="reading" />
        </div>

        <div className="form--main">
          <form>
            <input
              type="text"
              autoComplete="off"
              placeholder="User Name"
              name="userName"
              onChange={handleChange}
            />

            <input
              type="text"
              autoComplete="off"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
            />

            <input
              type="text"
              autoComplete="off"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
            />

            <input
              type="text"
              autoComplete="off"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />

            <input
              type="password"
              autoComplete="off"
              placeholder="Password"
              name="password"
              minlength="8"
              required
              onChange={handleChange}
            />
          </form>
          <button className="button-54" onClick={SignUp}>
            Sign Up
          </button>
        </div>
      </div>
      <h1 className="msg">{signupStatus}</h1>
    </div>
  );
}
