import { OnlineUsers } from "@/lib/Types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: OnlineUsers = {
  users: []
}

const onlineUsersSlice = createSlice({
  name: 'online-users',
  initialState,
  reducers: {
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.users = action.payload;
    },
  },
});

export const {setOnlineUsers} = onlineUsersSlice.actions
export default onlineUsersSlice.reducer