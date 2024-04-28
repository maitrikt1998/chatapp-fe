import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = 'http://127.0.0.1:8000'

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      await axios.post(`${backendURL}/api/register`, formData, config);

      // Return a success message or data if needed
      return 'Registration successful';
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await axios.post(`${backendURL}/api/login`, { email, password }, config);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
      try {
        localStorage.removeItem('userInfo');
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const createMessage = createAsyncThunk(
  'messages/send',
  async(messageData, { rejectWithValue }) => {
    try{
      const response = await axios.post('your_backend_api_url/messages', messageData);
      return response.data;
    }catch(error){
      return rejectWithValue(error.message);
    }
  }
);