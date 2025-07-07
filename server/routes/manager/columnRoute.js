import express from "express"
import protectRoute from "../../middlewares/authMiddleware.js"
import { createColumn, getColumns } from "../../controllers/manager/columnController.js"

const managerColumnRouter = express.Router()

managerColumnRouter.post("/createColumn",protectRoute,createColumn);
managerColumnRouter.get("/getColumns",protectRoute,getColumns);

export default managerColumnRouter; 