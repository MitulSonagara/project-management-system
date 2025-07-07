import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import {
  addComment,
  createTask,
  deleteTask,
  updateTaskPosition,
  getAllTasks
} from "../../controllers/user/taskController.js";
import { upload } from "../../middlewares/multerMiddleware.js";

const userTaskRouter = express.Router();

userTaskRouter.post(
  "/createTask",
  protectRoute,
  upload.array("attachments"),
  createTask
);

userTaskRouter.delete("/deleteTask", protectRoute, deleteTask);

userTaskRouter.put(
  "/updateTaskPosition/:taskId",
  protectRoute,
  updateTaskPosition
);
userTaskRouter.post("/addComment/:taskId", protectRoute, addComment);
userTaskRouter.get("/getAllTasks/:projectId",protectRoute,getAllTasks);

export default userTaskRouter;
