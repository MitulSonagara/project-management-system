import express from "express"
import protectRoute from "../../middlewares/authMiddleware.js"
import { getColumns } from "../../controllers/user/columnController.js"

const userColumnRouter = express.Router()

userColumnRouter.get("/getColumns",protectRoute,getColumns);

export default userColumnRouter