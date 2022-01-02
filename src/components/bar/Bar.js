import "./bar.css";
import { Logout, Person, Chat, Home } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import axios from "../../api/axios";

export default function Bar() {
  const { user, dispatch } = useContext(AuthContext);

  const handleLogoutButton = async () => {
    localStorage.removeItem("token");
    dispatch({ type: "SET_TOKEN", payload: null });
    try {
      await axios.get("/auth/logout");
    } catch (err) {}
  };

  return (
    <div className="barContainer">
      <div className="barLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Wayfarer</span>
        </Link>
      </div>
      <div className="barCenter">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Home fontSize="large" className="barIcon" />
        </Link>
        <Link
          to={`/profile/${user === null ? "" : user.userId}`}
          style={{ textDecoration: "none" }}
        >
          <Person fontSize="large" className="barIcon" />
        </Link>
        <Chat fontSize="large" className="barIcon" />
      </div>
      <div className="barRight">
        <Button onClick={handleLogoutButton}>
          <Logout fontSize="large" className="barIcon" />
        </Button>
      </div>
    </div>
  );
}
