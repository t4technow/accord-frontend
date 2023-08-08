import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FriendsState, User } from "@/lib/Types";

const initialState: FriendsState = {
  friendsList: [],
  pendingRequests: [],
  blockedFriends: [],
}

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriendsList: (state, action: PayloadAction<User[]>) => {
      state.friendsList = action.payload;
    },
    setPendingRequests: (state, action: PayloadAction<User[]>) => {
      state.pendingRequests = action.payload;
    },
    setBlockedFriends: (state, action: PayloadAction<User[]>) => {
      state.blockedFriends = action.payload
    }
  }
})

export const {setFriendsList, setPendingRequests, setBlockedFriends} = friendsSlice.actions
export default friendsSlice.reducer