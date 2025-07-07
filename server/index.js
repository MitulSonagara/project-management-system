import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./utils/dbconfig.js";
import morgan from "morgan";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import activityRouter from "./routes/activityRoute.js";
import adminDashboardRouter from "./routes/admin/dashboardRoute.js";
import adminAnalysisRouter from "./routes/admin/analysisRoute.js";
import adminProjectRouter from "./routes/admin/projectRoute.js";
import adminColumnRouter from "./routes/admin/columnRoute.js";
import adminTaskRouter from "./routes/admin/taskRoute.js";
import userDashboardRouter from "./routes/user/dashboardRoute.js";
import userProjectRouter from "./routes/user/projectRoute.js";
import userTaskRouter from "./routes/user/taskRoute.js";
import userColumnRouter from "./routes/user/columnRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import managerDashboardRouter from "./routes/manager/dashboardRoute.js";
import managerColumnRouter from "./routes/manager/columnRoute.js";
import managerProjectRouter from "./routes/manager/projectRoute.js";
import managerTaskRouter from "./routes/manager/taskRoute.js";
import chatRouter from "./routes/chatRoute.js";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const PORT = process.env.PORT || 8800;

dbConnection();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URI, // or where your web app is served from
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io; // Attach the 'io' object to the request
  next();
});

io.on("connection", (socket) => {
  io.emit("messageReceived", "Hello World");
  socket.on("disconnect", () => {
  });
});

const corsOptions = {
  origin: process.env.FRONTEND_URI,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/notification", notificationRouter);
app.use("/api/activity", activityRouter);
app.use("/api/admin", adminDashboardRouter);
app.use("/api/admin", adminAnalysisRouter);
app.use("/api/admin", adminColumnRouter);
app.use("/api/admin", adminTaskRouter);
app.use("/api/admin", adminProjectRouter);
app.use("/api/user", userDashboardRouter);
app.use("/api/user", userProjectRouter);
app.use("/api/user", userTaskRouter);
app.use("/api/user", userColumnRouter);
app.use("/api/manager", managerDashboardRouter);
app.use("/api/manager", managerColumnRouter);
app.use("/api/manager", managerTaskRouter);
app.use("/api/manager", managerProjectRouter);
app.use("/api/chat", chatRouter);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
