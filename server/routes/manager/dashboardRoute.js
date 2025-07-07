import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import {
  dashboardData,
  getAllProjectsWithProgress,
} from "../../controllers/manager/dashboardController.js";

const managerDashboardRouter = express.Router();

managerDashboardRouter.get("/getDashboard", protectRoute, dashboardData);

managerDashboardRouter.get(
  "/getDashboardTable",
  protectRoute,
  getAllProjectsWithProgress
);

export default managerDashboardRouter;
