import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import {
  dashboardData,
  getAllProjectsWithProgress,
} from "../../controllers/admin/dashboardController.js";

const adminDashboardRouter = express.Router();

adminDashboardRouter.get("/getDashboard", protectRoute, dashboardData);

adminDashboardRouter.get(
  "/getDashboardTable",
  protectRoute,
  getAllProjectsWithProgress
);

export default adminDashboardRouter;
