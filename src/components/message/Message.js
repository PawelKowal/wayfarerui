import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, user, own }) {
  const PF = process.env.REACT_APP_IMAGES;

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="conversationUserImg"
          src={PF + (user.image ? user.image : "defaultAvatar.jpg")}
          alt=""
        />
        <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBottom">{format(message.sendAt)}</div>
    </div>
  );
}
