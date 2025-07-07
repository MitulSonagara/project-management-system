import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../appConfig";

export const getRecentChats = createAsyncThunk("getRecentChats", async () => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/getRecentChats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getAllChats = createAsyncThunk(
  "getAllChats",
  async (_, { getState }) => {
    try {
      const { chat } = getState();
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/api/chat/getAllChats/${chat.chatUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const sendChat = createAsyncThunk(
  "sendChat",
  async (data, { dispatch }) => {
    try {
      const token = getToken();
      dispatch(getAllChats());
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/sendChat`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const markAsReadChats = createAsyncThunk(
  "markAsReadChats",
  async (userId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/api/chat/markAsReadChats/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    recentChats: [],
    allChats: [],
    chatUser: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.chatUser = {
        name: action.payload.name,
        id: action.payload._id,
      };
    },
    clearUser: (state, action) => {
      state.chatUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecentChats.fulfilled, (state, action) => {
        state.recentChats = action.payload.recentChats;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.allChats = action.payload.chats;
      });
  },
});

export const { setUser, clearUser } = chatSlice.actions;
export default chatSlice.reducer;
