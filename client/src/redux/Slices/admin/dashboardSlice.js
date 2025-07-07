import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../../appConfig";

export const getDashboard = createAsyncThunk("getDashboard", async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/getDashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getDashboardTable = createAsyncThunk(
  "/api/admin/getDashboardTable",
  async () => {
    const token = getToken();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/getDashboardTable`,
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

const initialState = {
  totalTask: 0,
  todoTask: 0,
  inProgressTask: 0,
  completedTask: 0,
  overDueTask: 0,
  totalProjects: 0,
  tableData: [],
};

const dashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.totalTask = action.payload.data.totalTask;
        state.todoTask = action.payload.data.todoTask;
        state.inProgressTask = action.payload.data.inProgressTask;
        state.completedTask = action.payload.data.completedTask;
        state.overDueTask = action.payload.data.overDueTask;
        state.totalProjects = action.payload.data.totalProjects;
      })
      .addCase(getDashboardTable.fulfilled, (state, action) => {
        state.tableData = action.payload.tableData;
      });
  },
});

export default dashboardSlice.reducer;
