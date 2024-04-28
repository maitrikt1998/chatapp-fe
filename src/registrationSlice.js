import { createSlice } from "@reduxjs/toolkit";
import { logoutUser, registerUser } from "./authActions";
import { loginUser } from "./authActions";

const initialState = {
    error: null,
    success: false,
    loading: false,
    userInfo: null,
    userToken: null,
}

const registrationSlice =  createSlice({
    name: 'register',
    initialState,
    reducers:{},
    extraReducers :(builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })
        .addCase(registerUser.rejected, (state, {payload}) => {
            state.loading = false
            state.error = payload
        })
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.userInfo = null; // Reset user info after logout
          })
          .addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    }
});

export default registrationSlice.reducer;