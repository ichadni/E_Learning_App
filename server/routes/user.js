import express from "express";
import {
  forgotPassword,
  loginUser,
  myProfile,
  register,
  resetPassword,
  verifyUser,
   getAllUser,    
  updateRole,
} 
from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import { addProgress, getYourProgress } from "../controllers/course.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/forgot", forgotPassword);
router.post("/user/reset", resetPassword);
router.post("/user/progress", isAuth, addProgress);
router.get("/user/progress", isAuth, getYourProgress);
router.get("/users", isAuth, getAllUser);        
router.put("/user/:id", isAuth, updateRole);  

export default router;