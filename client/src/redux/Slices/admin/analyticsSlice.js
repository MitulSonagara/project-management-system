import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../../appConfig";

export const getAnalyticsData = createAsyncThunk(
  "getAnalyticsData",
  async (projectId) => {
    const token = getToken();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/getAnalytics/${projectId}`,
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
  priority: [],
  columns: [],
  taskPerColumn: [],
};

const analyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAnalyticsData.fulfilled, (state, action) => {
      state.priority = action.payload.data.priority;
      state.columns = action.payload.data.label;
      state.taskPerColumn = action.payload.data.series;
    });
  },
});

export default analyticsSlice.reducer;
