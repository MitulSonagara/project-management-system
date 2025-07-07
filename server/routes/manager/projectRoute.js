import express from "express";
import { getAllProjects } from "../../controllers/manager/projectController.js";
import protectRoute from "../../middlewares/authMiddleware.js";

const managerProjectRouter = express.Router();

managerProjectRouter.get("/getAllProjects/:userId",protectRoute,getAllProjects)

export default managerProjectRouter;