import React from "react";

export default function Home(props) {
  const { posts } = props;

  if (posts) {
    return posts.map((post, index) => {
      return (
        <div className="post--container">
          <div className="post--img">
            <img
              className="postImg"
              src="images/book_read.png"
              alt="book__read"
            />
          </div>
          <div className="post--header" key={index}>
            <h1 className="post--title">{post.blogHeader} </h1>
          </div>
          <div className="post--desc" key={index}>
            <p>{post.blogDescription}</p>
          </div>
        </div>
      );
    });
  }
}
