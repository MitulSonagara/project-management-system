
import express from 'express';
import { getAllUsers, getProjectMembers } from '../controllers/userController.js';
import protectRoute from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/getProjectMembers/:projectId',protectRoute,getProjectMembers);
userRouter.get('/getAllUsers', protectRoute, getAllUsers)

export default userRouter;