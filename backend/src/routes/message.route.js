import express from "express";
import { protectRoute } from "../middlewares/userAuth.middleware.js";
import {
  getAllUsersForSidebar,
  getConversation,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// getAllUsersForSidebar
router.get("/users", protectRoute, getAllUsersForSidebar);

// Get Conversation between two users
router.get("/:id", protectRoute, getConversation);

// send message to a user
router.post("/:id", protectRoute, sendMessage);

export default router;
