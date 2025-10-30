import React from "react";
import { useRef } from "react";
import { useEffect } from "react";

const SenderMessage = ({ image, message }) => {
  let scroll = useRef();
  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="chat chat-end w-full h-fit">
      <div
        ref={scroll}
        className="chat-bubble w-fit max md:max-w-[300px] bg-[#605DFF] text-white flex flex-col gap-3 "
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

export default SenderMessage;
