import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "../../api/axios";
import "./register.css";
import { Button, TextField } from "@mui/material";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
      passwordAgain.current.reportValidity();
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        navigate("/login");
      } catch (err) {
        var errors = err.response.data.errors;
        var keys = Object.keys(errors);
        let errorsKeys = {};
        errorsKeys["emailErrors"] = keys.filter(isMatching(/email|Email/));
        errorsKeys["passwordErrors"] = keys.filter(
          isMatching(/password|Password/)
        );
        errorsKeys["otherErrors"] = keys.filter(
          isNotMatching(/email|Email|name|Name|password|Password/)
        );

        if (errorsKeys["emailErrors"].length > 0) {
          email.current.setCustomValidity(
            errorsKeys["emailErrors"].map((x) => errors[x]).join("\n")
          );
          email.current.reportValidity();
        }
        if (errorsKeys["passwordErrors"].length > 0) {
          password.current.setCustomValidity(
            errorsKeys["passwordErrors"].map((x) => errors[x]).join("\n")
          );
          password.current.reportValidity();
        }
        if (errorsKeys["otherErrors"].length > 0) {
          username.current.setCustomValidity(
            errorsKeys["otherErrors"].map((x) => errors[x]).join("\n")
          );
          username.current.reportValidity();
        }
      }
    }
  };

  function isMatching(regexp) {
    return (str) => regexp.test(str);
  }
  function isNotMatching(regexp) {
    return (str) => !regexp.test(str);
  }

  return (
    <div className="registerContainer">
      <div className="leftRegisterContainer">
        <div className="registerLogo">Wayfarer</div>
      </div>
      <div className="rightRegisterContainer">
        <div className="rightRegisterContainerTop" />
        <form className="rightRegisterContainerMiddle" onSubmit={handleClick}>
          <div>Create new account:</div>
          <TextField
            label="Username"
            variant="outlined"
            inputRef={username}
            required
            onChange={() => username.current.setCustomValidity("")}
          />
          <TextField
            label="Email"
            type="email"
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
            onChange={() => password.current.setCustomValidity("")}
          />
          <TextField
            label="Repeat password"
            type="password"
            variant="outlined"
            inputRef={passwordAgain}
            required
            onChange={() => passwordAgain.current.setCustomValidity("")}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: "#2fd138" }}
            type="submit"
          >
            Register
          </Button>
          <div>Already have account?</div>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button variant="contained" style={{ backgroundColor: "#2fd138" }}>
              Login
            </Button>
          </Link>
        </form>
        <div className="rightRegisterContainerBottom" />
      </div>
    </div>
  );
}
