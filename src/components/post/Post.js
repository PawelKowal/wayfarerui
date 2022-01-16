import "./post.css";
import { Favorite } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import Comment from "../comment/Comment";
import AddComment from "../addComment/AddComment";
import { format } from "timeago.js";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

export default function Post({
  post,
  setMapCenterLat,
  setMapCenterLng,
  disableShowOnMapButton,
}) {
  const [currentPost, setCurrentPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const PF = process.env.REACT_APP_IMAGES;

  const postReactionApi = async () => {
    try {
      await axios.post("/reactions/post/" + currentPost.postId);
      const response = await axios.get("/posts/" + currentPost.postId);
      setCurrentPost(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const refreshPostApi = async () => {
    try {
      const response = await axios.get("/posts/" + currentPost.postId);
      setCurrentPost(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const likeHandler = (e) => {
    e.preventDefault();
    postReactionApi();
  };

  const commentsButtonHandler = (e) => {
    e.preventDefault();
    setShowComments(true);
    refreshPostApi();
  };

  const showOnMapButtonHandler = (e) => {
    e.preventDefault();
    setMapCenterLat(post.latitude);
    setMapCenterLng(post.longitude);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${currentPost.userId}`}>
              <img
                className="postProfileImg"
                src={
                  PF +
                  (currentPost.user.image
                    ? currentPost.user.image
                    : "defaultAvatar.jpg")
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{currentPost.user.username}</span>
            <span className="postDate">
              {format(currentPost.publicationDate)}
            </span>
          </div>
          <div>
            {disableShowOnMapButton ? (
              ""
            ) : (
              <Button
                variant="contained"
                style={{ backgroundColor: "#2fd138" }}
                onClick={showOnMapButtonHandler}
              >
                Show on map
              </Button>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{currentPost.content}</span>
          <img
            className="postImg"
            src={
              PF + (currentPost.image ? currentPost.image : "defaultAvatar.jpg")
            }
            alt=""
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <Button onClick={likeHandler}>
              <div className="postReactionIcon">
                <Favorite color="error" />
              </div>
            </Button>
            <span className="postReactionCounter">
              {currentPost.reactionsCounter} people{" "}
              {currentPost.reacted ? "and you" : ""} love it
            </span>
          </div>
          <div className="postBottomRight">
            <Button
              onClick={commentsButtonHandler}
              style={{ color: "#2fd138" }}
            >
              <span className="postCommentText">comments</span>
            </Button>
          </div>
        </div>
        <div>
          {showComments &&
            currentPost.comments.map((c) => (
              <Comment
                key={c.commentId}
                comment={c}
                refreshPost={refreshPostApi}
              />
            ))}
          {showComments && (
            <div className="addComment">
              <AddComment post={currentPost} refreshPost={refreshPostApi} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
