import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../../../utils/auth";
import { API_BASE_URL } from "../../../appConfig";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchColumns = createAsyncThunk(
  "api/fetchColumns",
  async (_, { getState }) => {
    try {
      const token = getToken();
      const { userColumns } = getState();
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/api/user/getColumns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filters: userColumns.filters,
          userId: auth.user._id,
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

const updateTaskPosition = async (taskId, data) => {
  const token = getToken();
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/user/updateTaskPosition/${taskId}`,
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
};

export const updateTaskOrder = createAsyncThunk(
  "columns/updateTaskOrder",
  async ({ taskId, newColumnId, newIndex }, { dispatch }) => {
    try {
      const response = await updateTaskPosition(taskId, {
        columnId: newColumnId,
        order: newIndex,
      });

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      dispatch(fetchColumns());
      return { taskId, newColumnId, newIndex };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const columnsSlice = createSlice({
  name: "userColumns",
  initialState: {
    columnsList: [],
    status: "idle",
    error: null,
    isProjectSelected: false,
    filters: {
      selectedProject: "",
      priority: "",
      dueDate: "",
      search: "",
    },
  },
  reducers: {
    updateLocalTaskOrder(state, action) {
      const {
        sourceColumnId,
        destColumnName,
        destColumnId,
        sourceIndex,
        destIndex,
        task,
      } = action.payload;
      if (destColumnName === "Completed") {
        const incompleteDependencies = task.dependencies.filter(
          (dep) => dep.state !== "Completed"
        );
        if (incompleteDependencies.length > 0) {
          toast.error(
            "Cannot move to Completed. Dependencies are not completed."
          );
          return;
        } else {
          const sourceColumn = state.columnsList.find(
            (col) => col._id === sourceColumnId
          );
          sourceColumn.tasks.splice(sourceIndex, 1);

          const destColumn = state.columnsList.find(
            (col) => col._id === destColumnId
          );
          destColumn.tasks.splice(destIndex, 0, task);
        }
      } else {
        const sourceColumn = state.columnsList.find(
          (col) => col._id === sourceColumnId
        );
        sourceColumn.tasks.splice(sourceIndex, 1);

        const destColumn = state.columnsList.find(
          (col) => col._id === destColumnId
        );
        destColumn.tasks.splice(destIndex, 0, task);
      }
    },
    setSelectedProjectId: (state, action) => {
      state.filters.selectedProject = action.payload;
      state.isProjectSelected = true;
    },
    setPriority: (state, action) => {
      state.filters.priority = action.payload;
    },
    setDuedate: (state, action) => {
      state.filters.dueDate = action.payload;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.columnsList = action.payload.success
          ? action.payload.columnsWithTasks
          : [];
        state.status = "succeeded";
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(updateTaskOrder.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateTaskOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const {
  updateLocalTaskOrder,
  setSelectedProjectId,
  setDuedate,
  setPriority,
  setSearch,
} = columnsSlice.actions;
export default columnsSlice.reducer;
