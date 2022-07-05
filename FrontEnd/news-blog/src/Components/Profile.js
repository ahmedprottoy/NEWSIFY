import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileUI from "./ProfileUI";

export default function Profile() {
  const [profileInfo, getProfileInfo] = useState("");

  useEffect(() => {
    getAllUserInfo();
  }, []);

  const config = {
    headers: { "x-access-token": localStorage.getItem("accessToken") },
  };
  //   console.log(config);

  const getAllUserInfo = () => {
    axios
      .get("http://localhost:3001/show-user", config)
      .then((response) => {
        // console.log(response);
        const allInfo = response.data;
        getProfileInfo(allInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return <ProfileUI profileInfo={profileInfo} />;
}
