import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileUI(props) {
  const { profileInfo } = props;
  //   console.log(profileInfo[0].firstName);

  const navigate = useNavigate();

  if (profileInfo) {
    return profileInfo.map((profile, index) => {
      return (
        <div className="profile--container">
          <h1>Your Profile : </h1>
          <p key={index}>
            <span className="profile--title">User Name :</span>{" "}
            {profile.userName}
          </p>

          <p>
            <span className="profile--title">First Name :</span>{" "}
            {profile.firstName}
          </p>
          <p>
            <span className="profile--title">Last Name :</span>{" "}
            {profile.lastName}
          </p>
          <p>
            <span className="profile--title">Email :</span> {profile.email}
          </p>

          <div className="profile--button">
            {" "}
            <button
              className="profile--posts"
              onClick={() => navigate("/MyPost")}
            >
              My Posts
            </button>
          </div>
        </div>
      );
    });
  }
}
