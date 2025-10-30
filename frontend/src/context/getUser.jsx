import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const getUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(response.data));
      } catch (error) {
        console.log("User not fetched:", error);
      }
    };
    fetchUser();
  }, []);
};

export default getUser;
