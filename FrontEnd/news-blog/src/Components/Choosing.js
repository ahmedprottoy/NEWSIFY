import React from "react";

import { useNavigate } from "react-router-dom";

export default function Choosing() {
  // const history = useHistory();

  // const signUpPage = () => {
  //   history.push("/SignUp");
  // };
  const navigate = useNavigate();
  // navigate("/SignUp");
  return (
    <div className="choosing--main">
      <div className="choosing--banner">
        <h3>WELCOME TO </h3>
        <h1>NEWSIFY</h1>
        <img
          className="choosing--logo"
          src="images/bannerface.png"
          alt="logo"
        />
      </div>
      <div className="choosing--buttons">
        <button onClick={() => navigate("/SignUp")}>
          <img
            className="choosing--buttonlogo"
            src="images/signup2.png"
            alt="signup"
          />
          SIGN UP!
        </button>
        <button onClick={() => navigate("/LogIn")}>
          <img
            className="choosing--buttonlogo"
            src="images/login.png"
            alt="login"
          />
          LOG IN
        </button>
      </div>
    </div>
  );
}
