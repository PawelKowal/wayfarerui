import React from "react";
import "./user.css";
import { Button } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

export default function User({ user, refreshUser }) {
  const { user: loggedUser, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_IMAGES;

  const getUserApi = async () => {
    try {
      const response = await axios.get("/users");
      dispatch({ type: "SET_USER", payload: response.data });
    } catch (err) {
      localStorage.removeItem("token");
      dispatch({ type: "SET_TOKEN", payload: null });
    }
  };

  const handleUnfollowButton = async (e) => {
    e.preventDefault();
    try {
      await axios.delete("/follows/" + user.userId);
      refreshUser();
      getUserApi();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollowButton = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/follows/" + user.userId);
      refreshUser();
      getUserApi();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="user">
      <div className="userWrapper">
        <div className="avatarWrapper">
          <img
            className="userAvatar"
            src={PF + (user.image ? user.image : "defaultAvatar.jpg")}
            alt=""
          />
        </div>
        <div className="userInfoWrapper">
          <div className="userInfo">
            <div className="userUsername">{user.username}</div>
            <div className="userProfileDescription">
              {user.profileDescription}
            </div>
          </div>
          <div className="userEditButton">
            {loggedUser.userId === user.userId ? (
              <Link to="/editUser" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#2fd138" }}
                >
                  Edit profile
                </Button>
              </Link>
            ) : user.followers ? (
              user.followers.includes(loggedUser.userId) ? (
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#2fd138" }}
                  onClick={handleUnfollowButton}
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#2fd138" }}
                  onClick={handleFollowButton}
                >
                  Follow
                </Button>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
