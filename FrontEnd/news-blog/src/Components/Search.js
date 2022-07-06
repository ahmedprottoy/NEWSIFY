import React, { useState } from "react";
import axios from "axios";

export default function Search() {
  const [SearchData, setSearchData] = useState({
    userName: "",
    blogHeader: "",
  });

  const [SearchStatus, setSearchStatus] = useState([]);
  const [NoSearchStatus, setNoSearchStatus] = useState("");
  // console.log(SearchStatus);

  const config = {
    headers: { "x-access-token": localStorage.getItem("accessToken") },
  };

  function handleChange(event) {
    setSearchData((prevSearchData) => {
      return {
        ...prevSearchData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const Search = () => {
    axios
      .post("http://localhost:3001/show-specific-post", SearchData, config)
      .then((response) => {
        // // console.log(response.data);
        // const result = response.data;
        // setSearchStatus(result);

        setNoSearchStatus("");
        setSearchStatus([]);

        if (response.data.status === "no") {
          setNoSearchStatus(response.data.msg);
        } else {
          const result = response.data;
          setSearchStatus(result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="Search--container">
      <h2 className="Search--h"> Search By : </h2>
      <form>
        <input
          type="text"
          className="CreatePost--input"
          autoComplete="off"
          placeholder="User Name"
          name="userName"
          onChange={handleChange}
        />
        <h3 className="Search--h">Or,</h3>
        <textarea
          type="text"
          className="CreatePost--input searcht"
          autoComplete="off"
          placeholder="Title"
          name="blogHeader"
          onChange={handleChange}
        />
      </form>
      <button className="button-30 cpbut" onClick={Search}>
        Search
      </button>

      <h1 className="Search--h">Results :</h1>

      <h3 className="Search--h">{NoSearchStatus}</h3>

      {SearchStatus.map((content, index) => {
        return (
          <div>
            <div className="post--container search--r">
              <div className="post--img">
                <img
                  className="postImg"
                  src="images/book_read.png"
                  alt="book--read"
                />
              </div>

              <div className="post--header" key={index}>
                <h1 className="post--title">{content.blogHeader}</h1>
              </div>
              <div className="post--desc" key={index}>
                <p>{content.blogDescription}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
