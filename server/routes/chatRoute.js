import express from "express";
import {
  sendChat,
  getAllChats,
  getRecentChats,
  markAsReadChats,
} from "../controllers/chatController.js";
import protectRoute from "../middlewares/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.get("/getRecentChats", protectRoute, getRecentChats);
chatRouter.post("/sendChat", protectRoute, sendChat);
chatRouter.get("/getAllChats/:userId", protectRoute, getAllChats);
chatRouter.get("/markAsReadChats/:userId", protectRoute, markAsReadChats);

export default chatRouter;
 