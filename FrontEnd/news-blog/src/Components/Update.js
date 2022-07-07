import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Update() {
  const location = useLocation();

  const [updatePost, setUpdatePost] = useState([]);
  const [PostData, setPostData] = useState({
    blogHeader: "",
    blogDescription: "",
  });

  console.log(PostData);

  const postNo = location.state.id;
  // console.log(postNo);

  const config = {
    headers: { "x-access-token": localStorage.getItem("accessToken") },
  };

  function handleChange(event) {
    setPostData((prevloginData) => {
      return {
        ...prevloginData,
        [event.target.name]: event.target.value,
      };
    });
  }

  useEffect(() => {
    UpdatePost();
  }, []);

  const UpdatePost = () => {
    axios
      .get(`http://localhost:3001/updatePost/${postNo}`, config)
      .then((response) => {
        const upPost = response.data;
        console.log(upPost);
        // getMyPost(undefined);
        setUpdatePost(upPost);
      });
  };

  if (updatePost) {
    return updatePost.map((post, index) => {
      return (
        <div className="Update--container">
          {/* <p>{post.blogHeader}</p> */}
          <textarea
            type="text"
            className="CreatePost--input"
            autoComplete="off"
            placeholder="Post Title"
            defaultValue={post.blogHeader}
            name="blogHeader"
            onChange={handleChange}
          />
          <textarea
            type="text"
            className="CreatePost--input2 "
            autoComplete="off"
            placeholder="Post Details"
            defaultValue={post.blogDescription}
            name="blogDescription"
            onChange={handleChange}
          />
        </div>
      );
    });
  }
}
