import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./Slices/globalSlice";
import userReducer from "./Slices/userSlice";
import authReducer from "./Slices/authSlice";
import notificationReducer from "./Slices/notificationSlice";
import chatReducer from "./Slices/chatSlice";
import adminActivityReducer from "./Slices/activitySlice";

import adminColumnsReducer from "./Slices/admin/columnSlice";
import adminProjectReducer from "./Slices/admin/projectSlice";
import adminDashboardReducer from "./Slices/admin/dashboardSlice";
import adminAnalyticsReducer from "./Slices/admin/analyticsSlice";
import adminTaskReducer from "./Slices/admin/taskSlice";

import userColumnsReducer from "./Slices/user/columnSlice";
import userProjectReducer from "./Slices/user/projectSlice";
import userDashboardReducer from "./Slices/user/dashboardSlice";
import userTaskReducer from "./Slices/user/taskSlice";

import managerDashboardReducer from "./Slices/manager/dashboardSlice";
import managerColumnsReducer from "./Slices/manager/columnSlice";
import managerProjectReducer from "./Slices/manager/projectSlice";
import managerTaskReducer from "./Slices/manager/taskSlice";

export default configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer,
    auth: authReducer,
    notify: notificationReducer,
    activityLogSlice: adminActivityReducer,
    chat: chatReducer,

    adminColumns: adminColumnsReducer,
    adminProject: adminProjectReducer,
    adminDashboard: adminDashboardReducer,
    adminAnalytics: adminAnalyticsReducer,
    adminTask: adminTaskReducer,

    userColumns: userColumnsReducer,
    userProject: userProjectReducer,
    userDashboard: userDashboardReducer,
    userTask: userTaskReducer,

    managerColumns: managerColumnsReducer,
    managerProject: managerProjectReducer,
    managerDashboard: managerDashboardReducer,
    managerTask: managerTaskReducer,
  },
});
