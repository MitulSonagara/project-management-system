import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../../../appConfig";
import { setSelectedProjectId } from "./columnSlice";
import { getAllTasks } from "./taskSlice";

const initialState = {
  projectsList: [],
};

export const getAllProjects = createAsyncThunk(
  "api/user/getAllProjects",
  async (_, { getState, dispatch }) => {
    const token = getToken();
    const { auth } = getState();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/getAllProjects/${auth.user._id}`,
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
      return error.response.data;
    }
  }
);

const userProjectSlice = createSlice({
  name: "userProject",
  initialState,
  reducer: {},
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

export default userProjectSlice.reducer;
