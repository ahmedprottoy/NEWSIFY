import React from "react";
import Choosing from "./Components/Choosing";
import SignUp from "./Components/SignUp";
import LogIn from "./Components/LogIn";
// import Home from "./Components/Home";
import Posts from "./Components/Posts";
import Navbar from "./Components/Navbar";
import Profile from "./Components/Profile";
import MyPost from "./Components/MyPost";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Posts />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/MyPost" element={<MyPost />}></Route>
          <Route path="/Choosing" element={<Choosing />}></Route>
          <Route path="/SignUp" element={<SignUp />}></Route>
          <Route path="/LogIn" element={<LogIn />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
