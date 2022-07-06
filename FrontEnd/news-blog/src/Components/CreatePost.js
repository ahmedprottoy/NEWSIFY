import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [PostData, setPostData] = useState({
    blogHeader: "",
    blogDescription: "",
  });

  const config = {
    headers: { "x-access-token": localStorage.getItem("accessToken") },
  };

  const [CreateStatus, setCreateStatus] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    setPostData((prevloginData) => {
      return {
        ...prevloginData,
        [event.target.name]: event.target.value,
      };
    });
  }
  const CreatePost = () => {
    axios
      .post("http://localhost:3001/create-post", PostData, config)
      .then((response) => {
        if (response.data.status === "ok") {
          setCreateStatus(response.data.msg);
          setTimeout(() => {
            navigate("/MyPost");
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="CreatePost--container">
      <div className="CreatePost--header">
        <h1> Create An Article Here : </h1>
      </div>
      <form>
        <textarea
          type="text"
          className="CreatePost--input"
          autoComplete="off"
          placeholder="Post Title"
          name="blogHeader"
          onChange={handleChange}
        />
        <textarea
          type="text"
          className="CreatePost--input2 "
          autoComplete="off"
          placeholder="Post Details"
          name="blogDescription"
          onChange={handleChange}
        />
      </form>

      <button type="submit" className="button-30 cpbut" onClick={CreatePost}>
        Submit
      </button>

      <h2 className="CreatePost--status">{CreateStatus}</h2>
    </div>
  );
}
