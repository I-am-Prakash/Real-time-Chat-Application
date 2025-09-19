import express from "express";
import {
  checkAuthentication,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/userAuth.middleware.js";

const router = express.Router();

router.post("/signup", signup); 
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
// check use -> when refreshing the page
router.get("/check", protectRoute, checkAuthentication);

export default router;
