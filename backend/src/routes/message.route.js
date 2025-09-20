import express from "express";
import { protectRoute } from "../middlewares/userAuth.middleware";
import { getAllUsersForSidebar, getConversation, sendMessage } from "../controllers/message.controller";

const router = express.Router();

// getAllUsersForSidebar
router.get("/users", protectRoute, getAllUsersForSidebar);

// Get Conversation between two users
router.get("/:id", protectRoute, getConversation);

// send message to a user
router.post("/:id", protectRoute, sendMessage)

export default router;
