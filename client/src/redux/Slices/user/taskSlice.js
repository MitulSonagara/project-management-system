import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../../appConfig";

export const createTask = createAsyncThunk("/api/createTask", async (data) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/createTask`,
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
});

export const deleteTask = createAsyncThunk(
  "/api/deleteTask",
  async (taskId, { getState }) => {
    const token = getToken();
    const { auth } = getState();
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/user/deleteTask`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            taskId,
            userId: auth.user._id,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const addComment = createAsyncThunk("/api/addComment", async (data) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/addComment/${data.taskId}`,
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
});

export const getAllTasks = createAsyncThunk(
  "/api/getAllTasks",
  async (projectId) => {
    const token = getToken();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/getAllTasks/${projectId}`,
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

const taskSlice = createSlice({
  name: "userTask",
  initialState: {
    tasksList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllTasks.fulfilled, (state, action) => {
      state.tasksList = action.payload.success ? action.payload.tasks : [];
    });
  },
});

export default taskSlice.reducer
