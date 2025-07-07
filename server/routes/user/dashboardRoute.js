import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import {
  dashboardData,
  getAllProjectsWithProgress,
} from "../../controllers/user/dashboardController.js";

const userDashboardRouter = express.Router();

userDashboardRouter.get("/getDashboard", protectRoute, dashboardData);

userDashboardRouter.get(
  "/getDashboardTable",
  protectRoute,
  getAllProjectsWithProgress
);

export default userDashboardRouter;
