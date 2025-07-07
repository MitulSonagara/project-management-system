import express from "express";
import protectRoute from "../../middlewares/authMiddleware.js";
import { createColumn, getColumns } from "../../controllers/admin/columnController.js";

const adminColumnRouter = express.Router();

adminColumnRouter.post("/createColumn", protectRoute, createColumn);
adminColumnRouter.get("/getColumns", protectRoute, getColumns);


export default adminColumnRouter
