import { UserState } from "@/lib/Types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserState = {
    isAuthenticated: false,
    userId: null,
    username: "",
    access: '',
    refresh: '',
    loggedUser: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginReducer(state, action){
            state.isAuthenticated=true,
            state.userId = action.payload.userId
            state.username = action.payload.username
            state.access = action.payload.access
            state.refresh = action.payload.refresh
        },
        logoutReducer(state){
            state.isAuthenticated = false
            state.userId = null
            state.username = ""
            state.access = ''
            state.refresh = ''
            state.loggedUser = null
        },
        setCurrentUser(state, action) {
            state.loggedUser = action.payload
        }
    }
})


export const { loginReducer, logoutReducer, setCurrentUser } = userSlice.actions
export const userReducer = userSlice.reducer;