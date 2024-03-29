import React from "react";

const logout = () => {
  localStorage.removeItem("accessToken");
};

export default function Navbar() {
  return (
    <div className="navbar--container">
      <img className="nav--logo" src="images/logo.png" alt="logo" />

      <div className="nav--option">
        <a href="/">Home</a>
        <a href="/profile">Profile</a>
        <a href="/MyPost">My Posts</a>
        <a href="/CreatePost">Create Post</a>
        <a href="/Search">Search</a>
      </div>

      <div className="nav--srl">
        <a href="/Choosing" className="nav--button">
          <button className="button-30">Register / Log In</button>
          <button className="button-31" onClick={logout}>
            LogOut
          </button>
        </a>
      </div>
    </div>
  );
}
