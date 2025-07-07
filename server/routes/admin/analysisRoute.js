import express from "express"
import protectRoute from "../../middlewares/authMiddleware.js"
import { getTaskCountPerColumn } from "../../controllers/admin/analysisController.js"

const adminAnalysisRouter = express.Router();

adminAnalysisRouter.get("/getAnalytics/:projectId",getTaskCountPerColumn)

export default adminAnalysisRouter