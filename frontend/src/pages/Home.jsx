import React from "react";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";
import getUser from "../context/getUser";
import GetMessage from "../context/GetMessage";
import GetOtherUser from "../context/OtherUser";

const Home = () => {
  getUser();
  GetOtherUser();
  GetMessage();
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <MessageArea />
      </div>
    </div>
  );
};

export default Home;
