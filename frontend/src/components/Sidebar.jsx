import React from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.jpg";
import axios from "axios";
import { serverUrl } from "../main";
import {
  setOtherUser,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useEffect } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { userData, otherUser, selectedUser, onlineUser, searchData } =
    useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUser(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/user/search?query=${input}`,
          { withCredentials: true }
        );
        console.log(response.data);
        dispatch(setSearchData(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    if (input) {
      handleSearch();
    }
  }, [input]);
  return (
    <div
      className={`h-screen lg:w-[25%] w-full border-r-1 border-zinc-600 p-2 lg:block bg-[black] ${
        !selectedUser ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center gap-10 p-2">
        <div className="relative w-[130px] h-[130px] rounded-full">
          <div className="rounded-full w-[130px] h-[130px] bg-white flex items-center justify-center overflow-hidden ring-2 ring-primary shadow-[0_0_10px_#5754E8,0_0_10px_#5754E8]">
            <img
              className="w-full h-full object-cover rounded-full"
              src={userData.image || dp}
              alt=""
            />
          </div>
          <span
            onClick={() => navigate("/profile")}
            className="absolute bottom-[8%] right-[1%] flex justify-center items-center p-2 bg-zinc-600 rounded-full cursor-pointer shadow-[0_0_0px_#5754E8,1px_1px_10px_#5754E8] shadow-[#5754E8]"
          >
            <MdModeEditOutline />
          </span>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div>
            <p className="text-xl font-semibold">{userData.username}</p>
            <p className="text-sm text-zinc-500">{userData?.name}</p>
          </div>
          <button
            className="outline-none rounded-md cursor-pointer font-semibold btn btn-primary "
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <hr className="border-t-1 border-zinc-700 mt-5 mb-5" />

      {otherUser?.map(
        (user, index) =>
          onlineUser?.includes(user._id) && (
            <div key={index} className="relative w-12 h-12 rounded-full mb-5 ">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-[0_0_10px_#ffffff,0_0_5px_#ffffff] ring-2 ring-base">
                <img
                  className="w-full h-full object-cover "
                  src={user.image || dp}
                  alt=""
                />
              </div>
              <span className="w-[12px] h-[12px] rounded-full bg-green-600 absolute bottom-[8%] right-[1%]"></span>
            </div>
          )
      )}

      <div className="flex items-center justify-between w-full mb-5">
        <h2>Others</h2>
        {!showSearch && (
          <IoIosSearch
            className="w-10 h-6"
            onClick={() => setShowSearch((prev) => !prev)}
          />
        )}
        {showSearch && (
          <MdClose
            className="w-10 h-6"
            onClick={() => {
              setShowSearch(false);
              setInput("");
            }}
          />
        )}
      </div>
      {showSearch && (
        <form className="w-full mb-5">
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="border-2 border-base-200 w-full p-3 rounded outline-none"
            placeholder="search"
          />
        </form>
      )}

      {input.length == 0 &&
        otherUser?.map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-5 p-3 hover:bg-[#dadada] hover:text-black transition-all ease-linear duration-100 cursor-pointer"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-base">
              <img
                className="w-full h-full object-cover"
                src={user.image || dp}
                alt=""
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium">{user.username}</p>
              <p className="text-sm text-zinc-500">{user?.name}</p>
            </div>
          </div>
        ))}

      {input.length > 0 &&
        searchData?.map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-5 p-3 hover:bg-[#dadada] hover:text-black transition-all ease-linear duration-100 cursor-pointer "
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-base">
              <img
                className="w-full h-full object-cover"
                src={user.image || dp}
                alt=""
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium">{user.username}</p>
              <p className="text-sm text-zinc-500">{user?.name}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
