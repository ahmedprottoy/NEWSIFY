import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const [loginData, setloginData] = useState({
    userName: "",
    password: "",
  });

  const navigate = useNavigate();

  const [loginStatus, setloginStatus] = useState("");

  function handleChange(event) {
    setloginData((prevloginData) => {
      return {
        ...prevloginData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const login = () => {
    Axios.post("http://localhost:3001/login", {
      userName: loginData.userName,
      password: loginData.password,
    }).then((response) => {
      localStorage.setItem(
        "accessToken",
        // "Bearer " + response.data.accessToken
        response.data.accessToken
      );
      // console.log(response.data.nav);
      setloginStatus(response.data.user);

      if (response.data.nav === "ok") {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    });
  };

  return (
    <div>
      <div className="form--container">
        <div className="form--main--login">
          <form>
            <input
              type="text"
              className="form--input"
              autoComplete="off"
              placeholder="User Name"
              name="userName"
              onChange={handleChange}
            />

            <input
              type="password"
              className="form--input"
              autoComplete="off"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </form>

          <button type="submit" className="button-54" onClick={login}>
            Log In
          </button>
        </div>

        <div className="form--banner">
          <h3>Already a User?</h3>
          <h1>Log In</h1>
          <img className="form--img" src="images/loginimg.png" alt="loginimg" />
        </div>
      </div>
      <h1 className="msg">{loginStatus}</h1>
    </div>
  );
}
