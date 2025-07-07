import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../appConfig";

export const fetchActivityLogs = createAsyncThunk(
  "api/activity/fetchActivityLogs",
  async (projectId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/api/activity/fetchActivityLogs/${projectId}`,
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

const activitySlice = createSlice({
  name: "activityLogSlice",
  initialState: {
    activityList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityList = action.payload.success
          ? action.payload.activityLogs
          : [];
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.activityList = [];
      });
  },
});

export default activitySlice.reducer;
