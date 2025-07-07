import express from "express";
import { fetchActivityLogs } from "../controllers/activityController.js";
import protectRoute from "../middlewares/authMiddleware.js";

const activityRouter = express.Router();

activityRouter.get("/fetchActivityLogs/:projectId",protectRoute,fetchActivityLogs);

export default activityRouter