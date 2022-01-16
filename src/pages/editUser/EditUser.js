import "./editUser.css";
import Bar from "../../components/bar/Bar";
import { Button, TextField } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
import { useContext, useEffect, useState, useRef } from "react";

export default function EditUser() {
  const { user, dispatch } = useContext(AuthContext);
  const newProfileDesc = useRef();
  const [file, setFile] = useState(null);
  const PF = process.env.REACT_APP_IMAGES;

  const updateUserApi = async (updatedUser) => {
    try {
      await axios.put("/users", updatedUser);
      const response = await axios.get("/users");
      dispatch({ type: "SET_USER", payload: response.data });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitDescButton = (e) => {
    e.preventDefault();
    const updatedUser = new FormData();
    updatedUser.append("userId", user.userId);
    updatedUser.append("username", user.username);
    updatedUser.append("profileDescription", newProfileDesc.current.value);

    updateUserApi(updatedUser);
  };

  useEffect(() => {
    if (file !== null) {
      const updatedUser = new FormData();
      updatedUser.append("userId", user.userId);
      updatedUser.append("username", user.username);
      updatedUser.append("image", file);
      updatedUser.append("profileDescription", user.profileDescription);

      updateUserApi(updatedUser);

      setFile(null);
    }
  }, [file]);

  return (
    <div>
      <Bar />
      <div className="editUserContainer">
        <div className="editUserBox">
          <div className="username">{user.username}</div>
          <div className="editUser">
            <div className="editAvatar">
              <img
                className="userAvatar"
                src={PF + (user.image ? user.image : "defaultAvatar.jpg")}
                alt=""
              />
              <div className="editButton">
                <label htmlFor="file" className="shareOption">
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#2fd138" }}
                    component="label"
                  >
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    Choose new avatar
                  </Button>
                </label>
              </div>
            </div>
            <div className="editProfileDescription">
              <div className="profileDescription">
                {user.profileDescription}
              </div>
              <div className="newProfileDescription">
                <div className="inputContainer">
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="New profile description"
                    inputRef={newProfileDesc}
                  />
                </div>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#2fd138" }}
                  onClick={handleSubmitDescButton}
                >
                  Submit new description
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
