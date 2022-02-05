import "./conversation.css";
import React from "react";
import Message from "../../components/message/Message";
import { Link } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function Conversation({ recipent }) {
  const PF = process.env.REACT_APP_IMAGES;
  const CHAT_HUB = process.env.REACT_APP_CHAT_HUB;
  const newMessage = useRef();
  const [messages, setMessages] = useState();
  const [connection, setConnection] = useState(null);
  const { user } = useContext(AuthContext);
  const latestChat = useRef(null);

  latestChat.current = messages;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(CHAT_HUB, {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    getChatMessagesApi();
  }, [recipent]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          connection.on("ReceiveMessage", (message) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setMessages(updatedChat);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const getChatMessagesApi = async () => {
    try {
      const response = await axios.get(`/chats/${recipent.userId}`);
      setMessages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    const chatMessage = {
      receiverId: recipent.userId,
      message: newMessage.current.value,
    };
    try {
      connection.invoke("SendMessage", chatMessage);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendButton = (e) => {
    e.preventDefault();

    if (newMessage.current.value === "") {
      newMessage.current.setCustomValidity("Message can not be empty.");
      newMessage.current.reportValidity();
    } else {
      sendMessage();
      newMessage.current.value = "";
    }
  };

  return (
    <div className="conversationContainer">
      <div className="conversationTopContainer">
        <Link to={`/profile/${recipent.userId}`}>
          <img
            className="conversationUserImg"
            src={PF + (recipent.image ? recipent.image : "defaultAvatar.jpg")}
            alt=""
          />
        </Link>
        <p className="conversationUserUsername">{recipent.username}</p>
      </div>
      {messages &&
        user &&
        messages.map((m) => (
          <Message
            key={m.sendAt}
            message={m}
            user={m.authorId === user.userId ? user : recipent}
            own={m.authorId === user.userId ? true : false}
          />
        ))}
      <div className="conversationInputContainer">
        <div className="conversationInput">
          <TextField fullWidth label="Enter message" inputRef={newMessage} />
        </div>
        <div className="conversationSendButton">
          <Button
            variant="contained"
            style={{ backgroundColor: "#2fd138" }}
            onClick={handleSendButton}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
