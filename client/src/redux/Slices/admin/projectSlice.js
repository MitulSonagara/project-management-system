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
  async (_, { rejectWithValue, dispatch }) => {
    const token = getToken();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/getAllProjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setSelectedProjectId(response.data.projects[0]._id));
      dispatch(getAllTasks(response.data.projects[0]._id));
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data
        : "An error occurred while fetching projects.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createProject = createAsyncThunk(
  "api/createProject",
  async (data) => {
    const token = getToken();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/createProject`,
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

const projectSlice = createSlice({
  name: "adminProject",
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

export default projectSlice.reducer;
