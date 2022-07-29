import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Update() {
  const location = useLocation();
  const navigate = useNavigate();
  const postNo = location.state.id;
  const [updatePost, setUpdatePost] = useState([]);
  const [PostData, setPostData] = useState({
    blogHeader: "",
    blogDescription: "",
    postNo: postNo,
  });
  const [status, setStatus] = useState("");

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

        // getMyPost(undefined);
        setUpdatePost(upPost);
      });
  };

  const UpdatingPost = () => {
    axios
      .post("http://localhost:3001/update-post", PostData, config)
      .then((response) => {
        setStatus(response.data);
        setTimeout(() => {
          navigate("/MyPost");
        }, 3000);
      });
  };

  if (updatePost) {
    return updatePost.map((post, index) => {
      return (
        <div className="Update--container">
          {/* <p>{post.blogHeader}</p> */}
          <h3 className="Search--h">Title : </h3>
          <textarea
            type="text"
            className="CreatePost--input"
            autoComplete="off"
            placeholder="Post Title"
            defaultValue={post.blogHeader}
            name="blogHeader"
            onChange={handleChange}
          />
          <h3 className="Search--h">Description : </h3>
          <textarea
            type="text"
            className="CreatePost--input2 "
            autoComplete="off"
            placeholder="Post Details"
            defaultValue={post.blogDescription}
            name="blogDescription"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="button-30 cpbut"
            onClick={UpdatingPost}
          >
            Update
          </button>
          <h1 className="Search--h"> {status}</h1>
        </div>
      );
    });
  }
}
