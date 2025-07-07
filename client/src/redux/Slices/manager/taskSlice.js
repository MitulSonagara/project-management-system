import axios from "axios";
import { getToken } from "../../../utils/auth";
import { API_BASE_URL } from "../../../appConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createTask = createAsyncThunk("/api/createTask", async (data) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/manager/createTask`,
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

export const editTask = createAsyncThunk("/api/editTask", async (data) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/manager/editTask`,
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
        `${API_BASE_URL}/api/manager/deleteTask`,
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
      `${API_BASE_URL}/api/manager/addComment/${data.taskId}`,
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
  name: "managerTask",
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

