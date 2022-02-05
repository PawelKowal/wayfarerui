import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import EditUser from "./pages/editUser/EditUser";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Chat from "./pages/chat/Chat";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import axios from "./api/axios";

function App() {
  const { user, token, dispatch } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      if (token) {
        try {
          const response = await axios.get("/users");
          dispatch({ type: "SET_USER", payload: response.data });
        } catch (err) {
          localStorage.removeItem("token");
          dispatch({ type: "SET_TOKEN", payload: null });
        }
      }
    }
    fetchData();
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={token ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/profile/:id"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/editUser"
          element={token ? <EditUser /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={token ? <Chat /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
