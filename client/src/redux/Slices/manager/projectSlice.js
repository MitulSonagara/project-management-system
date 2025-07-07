import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../../utils/auth";
import { API_BASE_URL } from "../../../appConfig";
import { setSelectedProjectId } from "./columnSlice";
import { getAllTasks } from "./taskSlice";

const initialState = {
  projectsList: [],
};

export const getAllProjects = createAsyncThunk(
  "api/getAllProjects",
  async ({}, { getState, rejectWithValue, dispatch }) => {
    const token = getToken();
    const { auth } = getState();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/manager/getAllProjects/${auth.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setSelectedProjectId(response.data.projects[0]._id));
      dispatch(getAllTasks(response.data.projects[0]._id));
      return response.data; // Success
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data
        : "An error occurred while fetching projects.";
      return rejectWithValue(errorMessage); // Using rejectWithValue to return error message
    }
  }
);

const managerProjectSlice = createSlice({
  name: "managerProject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.projectsList = action.payload.success
          ? action.payload.projects
          : [];
      })
      .addCase(getAllProjects.rejected, (state) => {
        state.projectsList = [];
      });
  },
});

export default managerProjectSlice.reducer;
