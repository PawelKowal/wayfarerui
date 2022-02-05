import React from "react";
import "./conversationUser.css";

export default function ConversationUser({ user, setRecipent }) {
  const PF = process.env.REACT_APP_IMAGES;

  const selectConversationUser = (e) => {
    e.preventDefault();
    setRecipent(user);
  };

  return (
    <div className="conversationUserOuterContainer">
      <button
        className="conversationSelectUserButton"
        onClick={selectConversationUser}
      >
        <div className="conversationUserInnerContainer">
          <img
            className="conversationUserImg"
            src={PF + (user.image ? user.image : "defaultAvatar.jpg")}
            alt=""
          />
          <p className="conversationUserUsername">{user.username}</p>
        </div>
      </button>
    </div>
  );
}
