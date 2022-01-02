import React from "react";
import { useContext, useRef } from "react";
import "./login.css";
import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { updateAuthorizationHeader } from "../../api/axios";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    const user = {
      email: email.current.value,
      password: password.current.value,
    };

    try {
      const response = await axios.post("/auth/login", user);
      localStorage.setItem("token", response.data.accessToken);
      dispatch({ type: "SET_TOKEN", payload: response.data.accessToken });
      updateAuthorizationHeader();
      navigate("/");
    } catch (err) {
      email.current.setCustomValidity("Email or password are incorrect.");
      email.current.reportValidity();
    }
  };

  return (
    <div className="loginContainer">
      <div className="leftLoginContainer">
        <div className="loginLogo">Wayfarer</div>
      </div>
      <div className="rightLoginContainer">
        <div className="rightLoginContainerTop" />
        <form className="rightLoginContainerMiddle" onSubmit={handleClick}>
          <div>Login to your account:</div>
          <TextField
            label="Email"
            variant="outlined"
            inputRef={email}
            required
            onChange={() => email.current.setCustomValidity("")}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            inputRef={password}
            required
            onChange={() => email.current.setCustomValidity("")}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: "#2fd138" }}
            type="submit"
          >
            Login
          </Button>
          <div>Don't have account?</div>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Button variant="contained" style={{ backgroundColor: "#2fd138" }}>
              Register
            </Button>
          </Link>
        </form>
        <div className="rightLoginContainerBottom" />
      </div>
    </div>
  );
}
