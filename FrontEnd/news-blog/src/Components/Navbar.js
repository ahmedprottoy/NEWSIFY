import React from "react";

export default function Navbar() {
  return (
    <div className="navbar--container">
      <img className="nav--logo" src="images/logo.png" alt="logo" />

      <div className="nav--option">
        <a href="/">Home</a>
        <a href="/profile">Profile</a>
        <a href="/MyPost">My Posts</a>
      </div>

      <div className="nav--srl">
        <input
          type="text"
          className="nav--search"
          placeholder="  Search"
          name="search"
          autoComplete="off"
        />
        <a href="/Choosing" className="nav--button">
          <button className="button-30">Register / Log In</button>
        </a>
      </div>
    </div>
  );
}
