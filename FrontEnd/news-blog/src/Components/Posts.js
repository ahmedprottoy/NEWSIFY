import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./Home";

export default function Posts() {
  const [posts, getPosts] = useState("");

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = () => {
    axios.get("http://localhost:3001/show-posts").then((response) => {
      console.log(response);
      const allPosts = response.data;

      getPosts(allPosts);
    });
  };

  return <Home posts={posts} />;
}
