import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../utils/auth";
import { API_BASE_URL } from "../../appConfig";
import axios from "axios";

const initialState = {
  usersList: [],
  membersList: [],
};

export const getAllUsers = createAsyncThunk("/user/getAllUsers", async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/user/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
});

export const getProjectMembers = createAsyncThunk(
  "/user/getProjectMembers",
  async (projectId) => {
    const token = getToken();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/getProjectMembers/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response?.data;
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersList = action.payload.success ? action.payload.allUsers : [];
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.usersList = [];
      })
      .addCase(getProjectMembers.fulfilled, (state, action) => {
        state.membersList = action.payload.success
          ? action.payload.teamMembers
          : [];
      })
      .addCase(getProjectMembers.rejected, (state, action) => {
        state.membersList = [];
      });
  },
});

export default userSlice.reducer;