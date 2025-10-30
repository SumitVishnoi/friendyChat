import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import getUser from "./context/getUser";
import { useDispatch, useSelector } from "react-redux";
import GetOtherUser from "./context/OtherUser";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUser, setSocket } from "./redux/userSlice";
import Error from "./pages/Error";

function App() {
  getUser();
  GetOtherUser();
  const { userData, socket, onlineUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUser", (users) => {
        dispatch(setOnlineUser(users));
      });

      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);
  return (
    <div>
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/profile"} />}
        />
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="*"
          element={<Error />}
        />
      </Routes>
    </div>
  );
}

export default App;
