import express from "express";
import {
  loginUser,
  registerUser,
  checkAuth
} from "../controllers/authController.js";
import protectRoute from "../middlewares/authMiddleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.get("/checkAuth", protectRoute, checkAuth);

export default authRouter;