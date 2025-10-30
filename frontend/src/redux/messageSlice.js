import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messageData: [],
  },
  reducers: {
    setMessageData: (state, action) => {
      state.messageData = action.payload;
    },
  },
});

export const { setMessageData } = messageSlice.actions;

export default messageSlice.reducer;
