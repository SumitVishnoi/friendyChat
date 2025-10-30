import React, { useRef } from "react";
import { useEffect } from "react";

const ReceiverMessage = ({ image, message }) => {
  let scroll = useRef();
  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="chat chat-start w-full h-fit">
      <div
        ref={scroll}
        className="chat-bubble w-fit max-w-[500px] bg-white text-black flex flex-col items-center"
      >
        {image && (
          <img
            className="w-[150px] rounded-lg object-cover"
            src={image}
            alt=""
            onLoad={handleImageScroll}
          />
        )}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ReceiverMessage;
