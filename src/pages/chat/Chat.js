import "./chat.css";
import Bar from "../../components/bar/Bar";
import Conversation from "../../components/conversation/Conversation";
import React from "react";
import ConversationUser from "../../components/conversationUser/ConversationUser";
import { TextField, InputAdornment, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import axios from "../../api/axios";

export default function Chat() {
  const searchText = useRef();
  const [users, refreshUsers] = useState();
  const [recipent, setRecipent] = useState();

  const searchUsersApi = async (searchText) => {
    try {
      const response = await axios.get(`/users/search/${searchText}`);
      refreshUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllUsersApi = async () => {
    try {
      const response = await axios.get(`/users/all`);
      refreshUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllUsersApi();
  }, []);

  const handleSearchButton = (e) => {
    e.preventDefault();

    if (searchText.current.value === "") {
      searchText.current.setCustomValidity("Search text can not be empty.");
      searchText.current.reportValidity();
    } else {
      searchUsersApi(searchText.current.value);
    }
  };

  return (
    <div>
      <Bar />
      <div className="chatContainer">
        <div className="chatLeftContainerWrapper">
          <div className="chatLeftContainer">
            <div className="chatSearchContainer">
              <div className="chatSearchInput">
                <TextField
                  fullWidth
                  label="Enter username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  inputRef={searchText}
                />
              </div>
              <div className="chatSearchButton">
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#2fd138" }}
                  onClick={handleSearchButton}
                >
                  Search
                </Button>
              </div>
            </div>
            {users &&
              users.map((u) => (
                <ConversationUser
                  key={u.userId}
                  user={u}
                  setRecipent={setRecipent}
                />
              ))}
          </div>
        </div>
        <div className="chatRightContainerWrapper">
          {recipent && (
            <div className="chatRightContainer">
              <Conversation recipent={recipent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
