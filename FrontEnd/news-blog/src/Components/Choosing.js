import React from "react";

export default function Choosing() {
  return (
    <div className="choosing--main">
      <div className="choosing--banner">
        <h3>WELCOME TO </h3>
        <h1>NEWSIFY</h1>
        <img className="choosing--logo" src="images/student.png" alt="logo" />
      </div>
      <div className="choosing--buttons">
        <button>
          <img className="choosing--buttonlogo" src="images/signup2.png" />
          SIGN UP!
        </button>
        <button>
          <img className="choosing--buttonlogo" src="images/login.png" />
          LOG IN
        </button>
      </div>
    </div>
  );
}
