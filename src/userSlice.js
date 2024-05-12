import { createSlice,createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    users: [],
    loading: false,
    error: null,
    messages: [],
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

export const fetchMessage = createAsyncThunk(
    'user/fetchMessages',
    async({sender_id, receiver_id}, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${backendURL}/api/getmessages?sender_id=${sender_id}&receiver_id=${receiver_id}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  )

export const addNewMessage = createAction('user/addNewMessage');
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
        })
        .addCase(fetchMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchMessage.fulfilled, (state, action) => {
            state.loading = false;
            state.messages = action.payload;
            console.log(action.payload);
        })
        .addCase(fetchMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(addNewMessage, (state, action) => {
            state.messages.push(action.payload);
        });
    }
});

export default userSlice.reducer;
