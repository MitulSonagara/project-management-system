import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import {
  addComment,
  createTask,
  deleteTask,
  editTask,
  updateTaskPosition,
  getAllTasks
} from "../../controllers/manager/taskController.js";
import { upload } from "../../middlewares/multerMiddleware.js";

const managerTaskRouter = express.Router();

managerTaskRouter.post(
  "/createTask",
  protectRoute,
  upload.array("attachments"),
  createTask
);
managerTaskRouter.delete("/deleteTask", protectRoute, deleteTask);
managerTaskRouter.put(
  "/updateTaskPosition/:taskId",
  protectRoute,
  updateTaskPosition
);
managerTaskRouter.post("/addComment/:taskId", protectRoute, addComment);
managerTaskRouter.post("/editTask",protectRoute,editTask)
managerTaskRouter.get("/getAllTasks/:projectId",protectRoute,getAllTasks);

export default managerTaskRouter;
