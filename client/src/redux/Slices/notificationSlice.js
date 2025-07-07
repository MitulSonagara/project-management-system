import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getToken } from "../../utils/auth"
import axios from "axios";
import { API_BASE_URL } from "../../appConfig";

const initialState = {
    notifications:[],
    count:0,
}

export const fetchNotifications = createAsyncThunk(
    "/notification/fetchNotifications",
    async (userId) => {
        const token = getToken();
        try{
            const response = await axios.get(
                `${API_BASE_URL}/notification/fetchNotifications/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        }catch (error){
            return error.response.data;
        }
    }
)

export const clearNotification = createAsyncThunk(
    "notification/clearNotifications",
    async (userId) => {
        const token = getToken();
        try{
            const response = await axios.post(
                `${API_BASE_URL}/notification/clearNotifications`,
                userId,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
            )
            return response.data;
        }catch (error) {
            return error.response.data;
        }
    }
)

export const markAsReadNotifications = createAsyncThunk(
    "notification/markAsReadNotifications",
    async (userId) => {
        const token = getToken();
        try{
            const response = await axios.post(
                `${API_BASE_URL}/notification/markAsReadNotifications`,
                userId,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            return response.data;
        }catch (error) {
            return error.response.data;
        }
    }
)

const notificationSlice = createSlice({
    name:"notify",
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
            .addCase(fetchNotifications.fulfilled,(state,action)=>{
                state.notifications = action.payload.success? action.payload.notifications:[];
                state.count = action.payload.success? action.payload.count:0;
            })
            .addCase(markAsReadNotifications.fulfilled,(state,action)=>{
                state.notifications = action.payload.success? action.payload.notifications:[];
                state.count = 0;
            })
            .addCase(clearNotification.fulfilled,(state,action)=>{
                state.notifications = [];
                state.count = 0;
            })
    }
})

export default notificationSlice.reducer;