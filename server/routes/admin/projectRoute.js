import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import {
  createProject,
  getAllProjects,
} from "../../controllers/admin/projectController.js";

const adminProjectRouter = express.Router();

adminProjectRouter.post("/createProject", protectRoute, createProject);
adminProjectRouter.get("/getAllProjects", protectRoute, getAllProjects);

export default adminProjectRouter;