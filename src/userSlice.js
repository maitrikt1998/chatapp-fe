import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    users: [],
    loading: false,
    error: null,
};
const backendURL = 'http://127.0.0.1:8000';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async()=> {
    try {
        const response = await axios.get(`${backendURL}/api/userlist`);
        return response.data.user;
      } catch (error) {
        throw error;
      }
});


const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
            state.success = true;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default userSlice.reducer;
