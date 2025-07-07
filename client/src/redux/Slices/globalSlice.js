import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        isSidebarCollapsed: false,
        isDarkMode: false,
    },
    reducers: {
        setIsSidebarCollapsed: (state, action) => {
            state.isSidebarCollapsed = action.payload;
        },
        setIsDarkMode: (state, action) => {
            state.isDarkMode = action.payload;
        },
    }
});

export const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;
export default globalSlice.reducer;