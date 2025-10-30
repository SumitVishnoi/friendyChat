import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setMessageData } from "../redux/messageSlice";

const GetMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        if (!selectedUser?._id) return;
        const response = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser?._id}`,
          { withCredentials: true }
        );
        console.log(response.data);
        if (response.data) {
          dispatch(setMessageData(response.data));
        }
      } catch (error) {
        dispatch(setMessageData([]));
      }
    };
    fetchMessage();
  }, [selectedUser]);
};

export default GetMessage;
