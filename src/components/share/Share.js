import "./share.css";
import { PermMedia } from "@mui/icons-material";
import { Button, TextField, Popover } from "@mui/material";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";

export default function Share({ refreshPosts, position }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_IMAGES;
  const description = useRef();
  const [image, setImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverText, setPopoverText] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const sharePostApi = async (post) => {
    try {
      await axios.post("/posts", post);
      refreshPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleShareButton = (e) => {
    e.preventDefault();
    if (image === null) {
      setPopoverText("Image is required.");
      setAnchorEl(e.currentTarget);
      setOpen(true);
      return;
    }

    const post = new FormData();
    post.append("content", description.current.value);
    post.append("longitude", position.lng);
    post.append("latitude", position.lat);
    post.append("image", image);

    description.current.value = "";
    setImage(null);

    sharePostApi(post);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={PF + (user.image ? user.image : "defaultAvatar.jpg")}
            alt=""
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Describe your place here:"
            inputRef={description}
          />
        </div>
        <div className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: "#2fd138" }}
            onClick={handleShareButton}
          >
            Share
          </Button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div className="sharePopover">{popoverText}</div>
          </Popover>
        </div>
        {image && (
          <img className="shareImage" src={URL.createObjectURL(image)} alt="" />
        )}
      </div>
    </div>
  );
}
