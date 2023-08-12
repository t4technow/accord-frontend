import { ChatState, ChatType, CurrentChat } from "@/lib/Types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ChatState = {
  currentChat: null,
  chatType: '',
  target: null,
  showSidebar: false,
}

const ChatSlice = createSlice({
  name:'chat',
  initialState,
  reducers:{
    setCurrentChat(state, action: PayloadAction<CurrentChat>){
      state.currentChat = action.payload
    },
    setChatType (state,action :PayloadAction<ChatType>){
      state.chatType = action.payload
    },
    setTarget(state, action :PayloadAction<CurrentChat>){
      state.target = action.payload
    },
    setShowSidebar(state, action) {
        state.showSidebar = action.payload
    }
}})

export const {setChatType, setCurrentChat, setTarget, setShowSidebar} = ChatSlice.actions
export default ChatSlice.reducer