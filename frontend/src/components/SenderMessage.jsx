import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const SenderMessage = ({ image, message, video }) => {
  let scroll = useRef();
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image, video]);

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };

  // handle click on video
  const handleVideoClick = () => {
    if (!isReady) return;
    const videoElement = videoRef.current;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
    setIsExpanded(!isExpanded);
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setIsReady(true);
      scroll?.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="chat chat-end w-full h-fit">
      <div
        ref={scroll}
        className="chat-bubble w-fit max md:max-w-[300px] bg-[#605DFF] text-white flex flex-col gap-3"
      >
        {image && (
          <img
            className="w-[150px] rounded-lg object-cover "
            src={image}
            alt=""
            onLoad={handleImageScroll}
          />
        )}
        {video && (
          <video
            ref={videoRef}
            src={video}
            onLoadedData={handleVideoLoad}
            className={`rounded-lg object-cover cursor-pointer transition-all duration-300 ${
              isExpanded ? "w-[300px] h-[300px]" : "w-[150px] h-[150px]"
            }`}
            onClick={() => {
              if (!isReady) return; // video ready hone tak disable
              handleVideoClick();
            }}
            onEnded={() => {
              setIsPlaying(false);
              setIsExpanded(false);
            }}
          ></video>
        )}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default SenderMessage;
