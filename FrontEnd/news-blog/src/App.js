import React from "react";
import Choosing from "./Components/Choosing";
import SignUp from "./Components/SignUp";
import LogIn from "./Components/LogIn";
import Posts from "./Components/Posts";
import Navbar from "./Components/Navbar";
import Profile from "./Components/Profile";
import CreatePost from "./Components/CreatePost";
import MyPostUI from "./Components/MyPostUI";
import Search from "./Components/Search";
import Update from "./Components/Update";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Posts />}></Route>
          <Route path="/Update" element={<Update />}></Route>
          <Route path="/CreatePost" element={<CreatePost />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/MyPost" element={<MyPostUI />}></Route>
          <Route path="/Choosing" element={<Choosing />}></Route>
          <Route path="/SignUp" element={<SignUp />}></Route>
          <Route path="/LogIn" element={<LogIn />}></Route>
          <Route path="/Search" element={<Search />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
