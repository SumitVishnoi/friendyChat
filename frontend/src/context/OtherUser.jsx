import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setOtherUser } from "../redux/userSlice";

const GetOtherUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/other`, {
          withCredentials: true,
        });
        dispatch(setOtherUser(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchOtherUser();
  }, []);
};

export default GetOtherUser;
