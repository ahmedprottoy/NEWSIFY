import React, { useState, useEffect } from "react";
import axios from "axios";
// import MyPostUI from "./MyPostUI";

export default function MyPost() {
  const [myPost, getMyPost] = useState();

  useEffect(() => {
    getAllUserPost();
  }, []);

  const config = {
    headers: { "x-access-token": localStorage.getItem("accessToken") },
  };

  const getAllUserPost = () => {
    axios
      .get("http://localhost:3001/user-post", config)
      .then((response) => {
        const allUserPost = response.data;
        getMyPost(allUserPost);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePost = (postNo) => {
    axios
      .delete(`http://localhost:3001/delete-post/${postNo}`, config)
      .then((response) => {
        console.log(response);
        getMyPost(
          myPost.filter((value) => {
            return value.postNo !== postNo;
          })
        );
      });
  };

  if (myPost) {
    return myPost.map((post, index) => {
      return (
        <div className="post--container">
          <button
            className="delete--button"
            onClick={() => {
              deletePost(post.postNo);
            }}
          >
            Delete
          </button>
          <div className="post--img">
            <img
              className="postImg"
              src="images/book_read.png"
              alt="book--read"
            />
          </div>

          <div className="post--header" key={index}>
            <h1 className="post--title">{post.blogHeader}</h1>
          </div>
          <div className="post--desc" key={index}>
            <p>{post.blogDescription}</p>
          </div>
        </div>
      );
    });
  }
}
