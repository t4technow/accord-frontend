import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isAuthenticated: false,
        userId: '',
        username: "",
        access: '',
        refresh: '',
    },
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
            state.userId = ''
            state.username = ""
            state.access = ''
            state.refresh = ''
        }
    }
})


export const { loginReducer, logoutReducer } = userSlice.actions
export const userReducer = userSlice.reducer;