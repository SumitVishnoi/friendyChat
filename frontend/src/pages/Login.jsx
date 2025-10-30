import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      dispatch(setUserData(response.data));
      dispatch(setSelectedUser(null));
      setLoader(false);
      navigate("/");
      setErr("");
    } catch (error) {
      console.log(error);
      setLoader(false);
      if (error.response) {
        setErr(error.response.data.message);
      }
    }
  };
  return (
    <div className="bg-[#1D232A] h-screen flex justify-center items-center w-full">
      <fieldset className="fieldset bg-[#1A1D24] border-base-300 md:rounded-box w-sm border p-10 shadow-lg shadow-zinc-500">
        <legend className="fieldset-legend text-2xl">Login</legend>

        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-5">
            <h1 className="text-center text-lg">
              Welcome to{" "}
              <span className="text-[#605DFF] font-bold">friendy Chat</span>
            </h1>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoComplete="email"
                required
                className="input border-none outline-none"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="current-password"
                required
                className="input border-none outline-none"
                placeholder="Password"
              />
            </div>
            {err && (
              <div>
                <p className="text-red-600 text-center">{err}</p>
              </div>
            )}
          </div>
          <button className="btn btn-neutral hover:bg-zinc-900 mt-4 w-full">
            {loader ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Login"
            )}
          </button>
          <p className="text-center">
            Do you want to create a new account?{" "}
            <span
              className="text-[#605DFF] cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              signUp
            </span>
          </p>
        </form>
      </fieldset>
    </div>
  );
};

export default Login;
