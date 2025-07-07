import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import {
  getAllProjects,
} from "../../controllers/user/projectController.js";

const userProjectRouter = express.Router();

userProjectRouter.get("/getAllProjects/:userId", protectRoute, getAllProjects);

export default userProjectRouter;