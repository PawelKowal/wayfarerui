import "./addComment.css";
import { Button, TextField } from "@mui/material";
import { useContext, useRef, useEffect } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function AddComent({ post, refreshPost }) {
  const content = useRef();
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_IMAGES;

  const addCommentApi = async (comment) => {
    try {
      await axios.post("/comments", comment);
      refreshPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddCommentButton = (e) => {
    e.preventDefault();
    const comment = {
      content: content.current.value,
      postId: post.postId,
    };
    content.current.value = "";

    addCommentApi(comment);
  };

  useEffect(() => {}, [content.current]);

  return (
    <div className="addComment">
      <div className="addCommentWrapper">
        <div className="addCommentTop">
          <img
            className="addCommentProfileImg"
            src={PF + (user.image ? user.image : "defaultAvatar.jpg")}
            alt=""
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Comment:"
            inputRef={content}
          />
        </div>
        <div className="addCommentBottom">
          <Button
            variant="contained"
            style={{ backgroundColor: "#2fd138" }}
            onClick={handleAddCommentButton}
          >
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
