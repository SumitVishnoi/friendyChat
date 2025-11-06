import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      setLoader(false);
      navigate("/login");
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
      <fieldset className="fieldset bg-[#1A1D24] border-base-300 md:rounded-box md:w-sm w-md border p-10 shadow-lg shadow-zinc-500">
        <legend className="fieldset-legend text-2xl">Sign Up</legend>

        <form onSubmit={handleSignUp}>
          <div className="flex flex-col gap-5">
            <h1 className="text-center text-lg">
              Welcome to{" "}
              <span className="text-[#605DFF] font-bold">friendy Chat</span>
            </h1>
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                autoComplete="username"
                required
                className="input w-full border-none outline-none"
                placeholder="username"
              />
            </div>
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
              "Sign Up"
            )}
          </button>
          <p className="text-center">
            Already have an account?{" "}
            <span
              className="text-[#605DFF] cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              login
            </span>
          </p>
        </form>
      </fieldset>
    </div>
  );
};

export default SignUp;
