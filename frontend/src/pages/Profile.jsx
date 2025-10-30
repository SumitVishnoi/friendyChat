import axios from "axios";
import React, { useRef, useState } from "react";
import { IoCamera } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.jpg";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const dispatch = useDispatch();
  const image = useRef();

  const handleImge = async (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      let formData = new FormData();
      formData.append("name", name);

      if (backendImage) {
        formData.append("image", backendImage);
      }
      const response = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      setLoader(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-10">
      <div className="bg-[#1A1D24] rounded-box p-10 shadow-lg shadow-zinc-500 flex flex-col items-center justify-center w-[90%] md:w-lg">
        <div className="w-full">
          <FaArrowLeft
            onClick={() => navigate("/")}
            className="cursor-pointer"
          />
        </div>
        <div className="avatar relative">
          <div className="ring-primary ring-offset-base-400 w-24 rounded-full ring-2 ring-offset-2">
            <img src={frontendImage || userData.image || dp} />
          </div>
          <div
            className="absolute bottom-1 right-0 bg-[#605DFF] cursor-pointer rounded-full flex justify-center items-center"
            onClick={() => image.current.click()}
          >
            <IoCamera className="w-8 h-5" />
          </div>
        </div>

        <form className="bg--300 p-4 w-full" onSubmit={handleProfile}>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={image}
            onChange={handleImge}
          />
          <div className="flex flex-col gap-5">
            <div>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="input border-1 border-zinc-500 w-full outline-none"
                placeholder={userData ? userData.name : "name"}
              />
            </div>
            <div>
              <input
                type="text"
                readOnly
                className="input border-1 border-zinc-500 w-full outline-none"
                placeholder={userData?.username}
              />
            </div>
            <div>
              <input
                type="text"
                readOnly
                className="input border-1 border-zinc-500 w-full outline-none"
                placeholder={userData?.email}
              />
            </div>
          </div>

          <button
            className="btn btn-neutral hover:bg-zinc-900 mt-4 w-full"
          >
            {loader ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
