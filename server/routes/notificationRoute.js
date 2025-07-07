import express from "express";
import protectRoute from "../middlewares/authMiddleware.js";
import { fetchNotifications, clearNotifications, markAsReadNotifications } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/clearNotifications",protectRoute,clearNotifications);
notificationRouter.post("/markAsReadNotifications",protectRoute,markAsReadNotifications);
notificationRouter.get("/fetchNotifications/:userId",protectRoute,fetchNotifications);

export default notificationRouter