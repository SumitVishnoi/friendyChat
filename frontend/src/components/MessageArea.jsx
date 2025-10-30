import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.jpg";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { setSelectedUser } from "../redux/userSlice";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { IoSendSharp } from "react-icons/io5";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessageData } from "../redux/messageSlice";
import { useEffect } from "react";

const MessageArea = () => {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const { userData, selectedUser, socket } = useSelector((state) => state.user);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();
  const { messageData } = useSelector((state) => state.message);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.length == 0 && backendImage == null) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const response = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMessageData([...messageData, response.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleEmoji = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessageData([...messageData, mess]));
    });
    return () => socket.off("newMessage");
  }, [messageData, setMessageData]);
  return (
    <div
      className={`lg:w-[75%] w-full h-screen lg:flex ${
        selectedUser ? "flex" : "hidden"
      }`}
    >
      {selectedUser && (
        <div className="w-full flex flex-col justify-between gap-2">
          <div className="bg-primary h-[10%] flex items-center pl-5 gap-5 w-full">
            <FaLongArrowAltLeft
              className="w-8 h-6 cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            />
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-base flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                src={selectedUser?.image || dp}
                alt=""
              />
            </div>
            <p className="text-lg font-medium">{selectedUser?.username}</p>
          </div>

          <div className="h-[80%] overflow-auto px-[20px] flex flex-col gap-[15px] py-[10px] relative">
            {showPicker && (
              <div className="absolute bottom-[80px] ml-[20px] z-100">
                <EmojiPicker
                  width={250}
                  height={350}
                  onEmojiClick={handleEmoji}
                />
              </div>
            )}

            {messageData &&
              messageData.map((mess, index) =>
                mess.sender == userData._id ? (
                  <div key={index}>
                    <SenderMessage image={mess.image} message={mess.message} />
                  </div>
                ) : (
                  <div key={index}>
                    <ReceiverMessage
                      image={mess.image}
                      message={mess.message}
                    />
                  </div>
                )
              )}
          </div>

          <img
            src={frontendImage}
            className="w-[100px] absolute bottom-[15%] right-[8%] rounded-md"
            alt=""
          />
          
          <form
            onSubmit={handleSendMessage}
            className="mb-5 ml-5 w-[90%] flex items-center bg-[#FFFFFF] rounded-full overflow-hidden"
          >
            <div
              className="bg-[#605DFF] w-[50px] h-full flex justify-center items-center cursor-pointer"
              onClick={() => setShowPicker((prev) => !prev)}
            >
              <BsEmojiSmile className="bg-none w-10 h-6" />
            </div>
            <div className="w-full h-[50px] overflow-hidden flex items-center">
              <input
                type="file"
                accept="image/*"
                hidden
                ref={image}
                onChange={handleImage}
              />
              <input
                type="text"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                className="outline-none w-full h-full placeholder-zinc-500 px-5 text-[black] font-medium"
                placeholder="message"
              />
              <div className="text-zinc-500 w-[50px] h-full flex justify-center items-center cursor-pointer">
                <IoImageOutline
                  className="w-10 h-6"
                  onClick={() => image.current.click()}
                />
              </div>

              {(input.length > 0 || backendImage != null) && (
                <button className="text-[#605DFF] w-[50px] h-full flex justify-center items-center cursor-pointer">
                  <IoSendSharp className="w-10 h-6" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {!selectedUser && (
        <div className="h-screen flex justify-center items-center w-full">
          <h1 className="text-[50px] font-semibold text-zinc-500 ">
            Welcome to friendyChat
          </h1>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
