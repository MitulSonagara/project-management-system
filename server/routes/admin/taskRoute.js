import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import {
  createTask,
  updateTaskPosition,
  addComment,
  deleteTask,
  editTask,
  getAllTasks
} from "../../controllers/admin/taskController.js";
import { upload } from "../../middlewares/multerMiddleware.js";

const adminTaskRouter = express.Router();

adminTaskRouter.post(
  "/createTask",
  protectRoute,
  upload.array("attachments"),
  createTask
);
adminTaskRouter.put(
  "/updateTaskPosition/:taskId",
  protectRoute,
  updateTaskPosition
);
adminTaskRouter.post("/addComment/:taskId", protectRoute, addComment);
adminTaskRouter.delete("/deleteTask", protectRoute, deleteTask);
adminTaskRouter.post("/editTask",protectRoute,editTask)
adminTaskRouter.get("/getAllTasks/:projectId",protectRoute,getAllTasks);

export default adminTaskRouter;
