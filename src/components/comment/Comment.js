import "./comment.css";
import { Favorite } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import { format } from "timeago.js";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

export default function Comment({ comment, refreshPost }) {
  const [currentComment, setCurrentComment] = useState(comment);
  const PF = process.env.REACT_APP_IMAGES;

  const commentReactionApi = async () => {
    try {
      await axios.post("/reactions/comment/" + comment.commentId);
      refreshPost();
    } catch (err) {
      console.log(err);
    }
  };

  const likeHandler = (e) => {
    e.preventDefault();
    commentReactionApi();
  };

  return (
    <div className="comment">
      <div className="commentWrapper">
        <div className="commentTop">
          <div className="commentTopLeft">
            <Link to={`/profile/${comment.userId}`}>
              <img
                className="commentProfileImg"
                src={
                  PF +
                  (comment.user.image
                    ? comment.user.image
                    : "defaultAvatar.jpg")
                }
                alt=""
              />
            </Link>
            <span className="commentUsername">{comment.user.username}</span>
            <span className="commentDate">
              {format(comment.publicationDate)}
            </span>
          </div>
        </div>
        <div className="commentCenter">
          <span className="commentText">{comment.content}</span>
        </div>
        <div className="commentBottom">
          <div className="commentBottomLeft">
            <Button onClick={likeHandler}>
              <div className="commentReactionIcon">
                <Favorite color="error" />
              </div>
            </Button>
            <span className="commentReactionCounter">
              {comment.reactionsCounter} people{" "}
              {comment.reacted ? "and you" : ""} love it
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
