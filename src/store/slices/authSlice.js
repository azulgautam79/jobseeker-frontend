import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        accessToken: null, // access token
        initialized: false,
        isAuthenticated: false
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.initialized = true;
            state.isAuthenticated = true;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.initialized = true;
            state.isAuthenticated = false;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },

        finishInit: (state) => {
            state.initialized = true;
        },
    },

});

export const {
    setCredentials,
    clearCredentials,
    updateUser,
    finishInit,
} = authSlice.actions;
export default authSlice.reducer;
